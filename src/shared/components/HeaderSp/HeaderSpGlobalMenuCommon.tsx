import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { useState } from "react";
import styles from "./HeaderSp.module.scss";
import type { HeaderSpCommonMenu } from "./types.ts";

interface HeaderSpGlobalMenuCommonProps {
  menu: HeaderSpCommonMenu;
  onClickLink: () => void;
}

export const HeaderSpGlobalMenuCommon = ({ menu, onClickLink }: HeaderSpGlobalMenuCommonProps) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={styles.globalMenuCommon}>
      <button
        type="button"
        className={`${styles.title} ${isOpened ? styles.isOpened : ""}`}
        onClick={() => setIsOpened(!isOpened)}
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
