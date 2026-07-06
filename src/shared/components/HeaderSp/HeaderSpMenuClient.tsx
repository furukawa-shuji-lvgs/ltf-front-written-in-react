"use client";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { LoginInflowLink } from "@shared/components/LoginInflowLink/LoginInflowLink.tsx";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import styles from "./HeaderSp.module.scss";
import { HeaderSpGlobalMenuCommon } from "./HeaderSpGlobalMenuCommon.tsx";
import { CloseIcon, EditSquareIcon } from "./HeaderSpIcons.tsx";
import type { HeaderSpNavButton, HeaderSpViewData } from "./types.ts";
import { useDialogFocusTrap } from "./useDialogFocusTrap.ts";

type HeaderSpMenuData = Pick<
  HeaderSpViewData,
  "navHead" | "projectMenu" | "serviceMenu" | "usefulMenu" | "companyLink" | "login"
>;

interface HeaderSpMenuClientProps {
  button: HeaderSpNavButton;
  menu: HeaderSpMenuData;
}

export const HeaderSpMenuClient = ({ button, menu }: HeaderSpMenuClientProps) => {
  const [spMenuOpened, setSpMenuOpened] = useState(false);
  const [projectMenuOpened, setProjectMenuOpened] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const closeSpMenu = useCallback(() => {
    setSpMenuOpened(false);
    setProjectMenuOpened(false);
  }, []);

  useDialogFocusTrap({
    isOpen: spMenuOpened,
    dialogRef,
    initialFocusRef: closeButtonRef,
    onClose: closeSpMenu,
  });

  const className = `${styles.linkButton} ${button.isCta ? styles.cta : ""}`;

  return (
    <>
      <button
        type="button"
        data-click-label={button.dataClickLabel}
        className={className}
        onClick={() => setSpMenuOpened((opened) => !opened)}
      >
        <LegacyImage
          src={button.icon.src}
          width={button.icon.width}
          height={button.icon.height}
          alt={button.icon.alt}
          className={styles.icon}
        />
        {button.text}
      </button>
      {spMenuOpened && (
        <>
          <button
            type="button"
            aria-label="メニュー外の背景"
            tabIndex={-1}
            className={styles.globalNavMask}
            onClick={closeSpMenu}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="グローバルメニュー"
            className={styles.globalNav}
          >
            <nav aria-label="グローバルメニュー">
              <div className={styles.globalNavHead}>
                <Link
                  href={menu.navHead.logo.href}
                  data-click-label={menu.navHead.logo.dataClickLabel}
                >
                  <LegacyImage
                    src={menu.navHead.logo.image.src}
                    width={menu.navHead.logo.image.width}
                    height={menu.navHead.logo.image.height}
                    alt={menu.navHead.logo.image.alt}
                  />
                </Link>
                <div className={styles.buttons}>
                  <a
                    href={menu.navHead.register.href}
                    data-click-label={menu.navHead.register.dataClickLabel}
                    className={styles.ctaButton}
                  >
                    <EditSquareIcon />
                    {menu.navHead.register.text}
                  </a>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    data-click-label={menu.navHead.close.dataClickLabel}
                    className={styles.close}
                    onClick={closeSpMenu}
                  >
                    <CloseIcon />
                    {menu.navHead.close.text}
                  </button>
                </div>
              </div>
              <div className={styles.globalMenuList}>
                <div className={styles.globalMenuProject}>
                  <p className={styles.title}>{menu.projectMenu.title}</p>
                  <button
                    type="button"
                    className={`${styles.projectMenuTitle} ${projectMenuOpened ? styles.isOpened : ""}`}
                    onClick={() => setProjectMenuOpened(!projectMenuOpened)}
                  >
                    {menu.projectMenu.category.title}
                  </button>
                  {projectMenuOpened && (
                    <div className={styles.projectCategoryLinks}>
                      {menu.projectMenu.category.links.map((link) => (
                        <a
                          key={link.text}
                          href={link.href}
                          data-click-label={link.dataClickLabel}
                          className={styles.link}
                          onClick={closeSpMenu}
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className={styles.cta}>
                    <a
                      href={menu.projectMenu.category.cta.href}
                      data-click-label={menu.projectMenu.category.cta.dataClickLabel}
                      className={styles.ctaLink}
                      onClick={closeSpMenu}
                    >
                      {menu.projectMenu.category.cta.text}
                    </a>
                  </div>
                  <a
                    href={menu.projectMenu.link.href}
                    data-click-label={menu.projectMenu.link.dataClickLabel}
                    className={styles.link}
                  >
                    {menu.projectMenu.link.text}
                  </a>
                </div>
                <HeaderSpGlobalMenuCommon
                  menu={menu.serviceMenu}
                  onClickLink={closeSpMenu}
                />
                <HeaderSpGlobalMenuCommon
                  menu={menu.usefulMenu}
                  onClickLink={closeSpMenu}
                />
                <a
                  href={menu.companyLink.href}
                  data-click-label={menu.companyLink.dataClickLabel}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  {menu.companyLink.text}
                  <LegacyImage
                    src={menu.companyLink.logo.src}
                    width={menu.companyLink.logo.width}
                    height={menu.companyLink.logo.height}
                    alt=""
                    className={styles.logoIcon}
                  />
                </a>
              </div>
              <LoginInflowLink
                href={menu.login.href}
                data-click-label={menu.login.dataClickLabel}
                className={styles.loginButton}
              >
                {menu.login.text}
              </LoginInflowLink>
            </nav>
          </div>
        </>
      )}
    </>
  );
};
