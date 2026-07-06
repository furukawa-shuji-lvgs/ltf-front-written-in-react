import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import Link from "next/link";
import styles from "./HeaderSp.module.scss";
import { HeaderSpMenuClient } from "./HeaderSpMenuClient.tsx";
import type { HeaderSpNavButton, HeaderSpViewData } from "./types.ts";

interface HeaderSpViewProps {
  isStatic: boolean;
  data: HeaderSpViewData;
}

const HeaderSpNavButtonLink = ({ button }: { button: HeaderSpNavButton }) => {
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
  buttons: HeaderSpNavButton[];
  menu?: HeaderSpNavButton | undefined;
  menuData?: HeaderSpViewData | undefined;
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
  const rightLinkButtons = data.rightButtons.filter((button) => button.href !== null);
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
        buttons={rightLinkButtons}
        menu={menuButton}
        menuData={data}
      />
    </header>
  );
};
