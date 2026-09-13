import Link from "next/link";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";

import type { HeaderSpNavButton, HeaderSpViewData } from "./types.ts";

import { HeaderSpMenuClient } from "./HeaderSpMenuClient.tsx";

import styles from "./HeaderSp.module.scss";

interface HeaderSpViewProps {
  readonly isStatic: boolean;
  readonly data: HeaderSpViewData;
}

const HeaderSpNavButtonLink = ({ button }: { readonly button: HeaderSpNavButton }) => {
  if (button.href === null) {
    return null;
  }

  const className = `${styles.linkButton} ${button.isCta ? styles.cta : ""}`;

  return (
    <a
      href={button.href}
      target={button.target || undefined}
      rel={button.rel || undefined}
      data-click-label={button.dataClickLabel}
      className={className}
    >
      <LegacyImage
        src={button.icon.src}
        width={button.icon.width}
        height={button.icon.height}
        alt={button.icon.alt}
        className={styles.icon}
      />
      {button.text}
    </a>
  );
};

const HeaderSpNavButtonGroup = ({
  buttons,
  menu,
  menuData,
}: {
  readonly buttons: readonly HeaderSpNavButton[];
  readonly menu?: HeaderSpNavButton | undefined;
  readonly menuData?: HeaderSpViewData | undefined;
}) => (
  <div className={styles.globalNavButtons}>
    {buttons.map((button) => (
      <HeaderSpNavButtonLink
        key={button.text}
        button={button}
      />
    ))}
    {menu && menuData ? (
      <HeaderSpMenuClient
        button={menu}
        // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop -- Server Component でクライアントに渡すデータを必要な項目に絞る。
        menu={{
          navHead: menuData.navHead,
          projectMenu: menuData.projectMenu,
          serviceMenu: menuData.serviceMenu,
          usefulMenu: menuData.usefulMenu,
          companyLink: menuData.companyLink,
          login: menuData.login,
        }}
      />
    ) : null}
  </div>
);

export const HeaderSpView = ({ isStatic, data }: HeaderSpViewProps) => {
  const menuButton = data.rightButtons.find((button) => button.href === null && button.isMenu);

  return (
    <header className={`${styles.baseHeader} ${isStatic ? styles.isStatic : ""}`}>
      <HeaderSpNavButtonGroup buttons={data.leftButtons} />
      <Link
        href={data.logo.href}
        data-click-label={data.logo.dataClickLabel}
        className={styles.logo}
      >
        <LegacyImage
          src={data.logo.image.src}
          width={data.logo.image.width}
          height={data.logo.image.height}
          alt={data.logo.image.alt}
        />
      </Link>
      <HeaderSpNavButtonGroup
        buttons={data.rightButtons}
        menu={menuButton}
        menuData={data}
      />
    </header>
  );
};
