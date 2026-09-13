import Link from "next/link";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { FooterData } from "@shared/constants/footer.ts";
import { LtServices } from "@shared/constants/ltServices.ts";
import { imageUrl } from "@shared/lib/image.ts";

import { PageTopButton } from "./PageTopButton.tsx";

import styles from "./FooterPc.module.scss";

export interface FooterPcProps {
  readonly isShowPageTop?: boolean;
}

const checkTargetBlank = (link: string) => (/^https?:\/\//u.test(link) ? "_blank" : undefined);

const FooterLink = ({
  href,
  text,
  dataClickLabel,
}: {
  readonly href: string;
  readonly text: string;
  readonly dataClickLabel: string | null;
}) => {
  const target = checkTargetBlank(href);
  if (target) {
    return (
      <a
        href={href}
        target={target}
        rel="noreferrer"
        data-click-label={dataClickLabel ?? undefined}
        className={styles.textLink}
      >
        {text}
      </a>
    );
  }
  return (
    <Link
      href={href}
      data-click-label={dataClickLabel ?? undefined}
      className={styles.textLink}
    >
      {text}
    </Link>
  );
};

const footerData = FooterData;
const ltUrl = new URL(footerData.pc.footerLogo.path, LtServices.LT_CO_URL);
const commonLinks = footerData.pc.commonLinks.map((link) => ({
  ...link,
  href: "isBrand" in link && link.isBrand ? new URL(link.path, LtServices.LT_URL).href : link.path,
}));
const serviceLinks = footerData.serviceLinks.itemList.map((link) => ({
  ...link,
  href: LtServices[link.urlKey] ?? "",
}));
const pageTopImage = { ...footerData.pc.pageTop, src: imageUrl(footerData.pc.pageTop.src) };
const ismsLogoSrc = imageUrl(footerData.pc.ismsLogo.src);
const footerLogoSrc = imageUrl(footerData.pc.footerLogo.logo.src);

// 移行メモ: 旧 BaseFooterPc の isPageTopSticky / isWithSideEf（OrganismsStickyPageTop）は未移植。
// 追従ページトップボタンが必要になったタイミングで移植する。
export const FooterPc = ({ isShowPageTop = true }: FooterPcProps) => (
  <footer className={styles.baseFooter}>
    <div className={styles.inner}>
      {isShowPageTop && <PageTopButton image={pageTopImage} />}
      <ul className={styles.linkList}>
        {commonLinks.map((link) => (
          <li
            key={link.text}
            className={styles.item}
          >
            <FooterLink
              href={link.href}
              text={link.text}
              dataClickLabel={link.dataClickLabel}
            />
          </li>
        ))}
      </ul>
      <div className={styles.projectLinksWrapper}>
        <p className={styles.title}>{footerData.pc.projectLinksTitle}</p>
        <ul className={styles.linkList}>
          {footerData.pc.projectLinks.map((link) => (
            <li
              key={link.text}
              className={styles.item}
            >
              <FooterLink
                href={link.path}
                text={link.text}
                dataClickLabel={link.dataClickLabel}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.serviceLinksWrapper}>
        <p className={styles.title}>{footerData.serviceLinks.title}</p>
        <ul className={styles.serviceLinkList}>
          {serviceLinks.map((link) => (
            <li
              key={link.text}
              className={styles.item}
            >
              <FooterLink
                href={link.href}
                text={link.text}
                dataClickLabel={link.dataClickLabel}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className={styles.footerBottom}>
      <div className={styles.inner}>
        <a
          href={footerData.pc.ismsLogoUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.ismsLogo}
        >
          <LegacyImage
            src={ismsLogoSrc}
            width={footerData.pc.ismsLogo.width}
            height={footerData.pc.ismsLogo.height}
            alt={footerData.pc.ismsLogo.alt}
          />
        </a>
        <div className={styles.logo}>
          <a
            href={ltUrl.href}
            target="_blank"
            rel="noreferrer"
          >
            <LegacyImage
              src={footerLogoSrc}
              width={footerData.pc.footerLogo.logo.width}
              height={footerData.pc.footerLogo.logo.height}
              alt={footerData.pc.footerLogo.logo.alt}
            />
          </a>
          <small className={styles.footerCopyright}>
            &copy; 2017-{new Date().getFullYear()} Levtech Co., Ltd.
          </small>
        </div>
      </div>
    </div>
  </footer>
);
