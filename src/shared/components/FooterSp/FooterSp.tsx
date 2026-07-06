import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { FooterData } from "@shared/constants/footer.ts";
import { LtServices } from "@shared/constants/ltServices.ts";
import { imageUrl } from "@shared/lib/image.ts";
import Link from "next/link";
import styles from "./FooterSp.module.scss";

const checkTargetBlank = (link: string) => (/^https?:\/\//.test(link) ? "_blank" : undefined);

const FooterLink = ({
  href,
  text,
  dataClickLabel,
}: {
  href: string;
  text: string;
  dataClickLabel: string | null;
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
const serviceLinks = footerData.serviceLinks.itemList.map((link) => ({
  ...link,
  href: LtServices[link.urlKey] ?? "",
}));

const bottomLinks = footerData.sp.bottomLinks.map((link) => ({
  ...link,
  href: "isBrand" in link && link.isBrand ? new URL(link.path, LtServices.LT_URL).href : link.path,
}));
const ismsLogoSrc = imageUrl(footerData.sp.ismsLogo.src);
const footerLogoSrc = imageUrl(footerData.pc.footerLogo.logo.src);

export const FooterSp = () => {
  return (
    <footer className={styles.baseFooter}>
      <div className={styles.content}>
        <div className={styles.projectLinkListWrapper}>
          <p className={styles.title}>{footerData.sp.projectLinkTitle}</p>
          {footerData.sp.projectLinkInfos.map((info) => (
            <dl
              key={info.title}
              className={styles.projectLinkListInfo}
            >
              <dt className={styles.title}>{info.title}</dt>
              <dd className={styles.infoContent}>
                <ul className={styles.linkList}>
                  {info.projectLinks.map((link) => (
                    <li key={link.text}>
                      <FooterLink
                        href={link.path}
                        text={link.text}
                        dataClickLabel={link.dataClickLabel}
                      />
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          ))}
        </div>
        <div className={styles.serviceLinkListWrapper}>
          <p className={styles.title}>{footerData.serviceLinks.title}</p>
          <ul className={styles.serviceLinkList}>
            {serviceLinks.map((link) => (
              <li key={link.text}>
                <FooterLink
                  href={link.href}
                  text={link.text}
                  dataClickLabel={link.dataClickLabel}
                />
              </li>
            ))}
          </ul>
        </div>
        <ul className={styles.bottomLinkList}>
          {bottomLinks.map((link) => (
            <li key={link.text}>
              <FooterLink
                href={link.href}
                text={link.text}
                dataClickLabel={link.dataClickLabel}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.content}>
          <a
            href={footerData.sp.ismsLogoUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.ismsLogo}
          >
            <LegacyImage
              src={ismsLogoSrc}
              width={footerData.sp.ismsLogo.width}
              height={footerData.sp.ismsLogo.height}
              alt={footerData.sp.ismsLogo.alt}
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
};
