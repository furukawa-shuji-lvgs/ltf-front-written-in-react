import { useCallback, useState } from "react";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";

import type { HeaderSpCommonMenu } from "./types.ts";

import styles from "./HeaderSp.module.scss";

interface HeaderSpGlobalMenuCommonProps {
  readonly menu: HeaderSpCommonMenu;
  readonly onClickLink: () => void;
}

export const HeaderSpGlobalMenuCommon = ({ menu, onClickLink }: HeaderSpGlobalMenuCommonProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsOpened((opened) => !opened);
  }, []);

  return (
    <div className={styles.globalMenuCommon}>
      <button
        type="button"
        className={`${styles.title} ${isOpened ? styles.isOpened : ""}`}
        onClick={toggleMenu}
      >
        {menu.title}
      </button>
      {isOpened && (
        <ul className={styles.menuLinks}>
          {menu.links.map((link) => (
            <li
              key={link.text}
              className={styles.item}
            >
              <a
                href={link.href}
                target={link.target || undefined}
                data-click-label={link.dataClickLabel}
                className={styles.link}
                onClick={onClickLink}
              >
                {link.text}
                {link.logo && (
                  <LegacyImage
                    src={link.logo.src}
                    width={link.logo.width}
                    height={link.logo.height}
                    alt=""
                    className={styles.icon}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
