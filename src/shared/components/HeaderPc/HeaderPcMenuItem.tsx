"use client";

import type { FocusEvent, ReactNode } from "react";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { CommonNavData } from "./types.ts";

import styles from "./HeaderPc.module.scss";

type HeaderPcMenuKey = "project" | CommonNavData["menuKey"];

interface HeaderPcMenuContextValue {
  readonly activeMenuKey: HeaderPcMenuKey | null;
  readonly setActiveMenuKey: (menuKey: HeaderPcMenuKey | null) => void;
}

const HeaderPcMenuContext = createContext<HeaderPcMenuContextValue | null>(null);

export const HeaderPcMenuList = ({ children }: { readonly children: ReactNode }) => {
  const [activeMenuKey, setActiveMenuKey] = useState<HeaderPcMenuKey | null>(null);
  const menuContext = useMemo(() => ({ activeMenuKey, setActiveMenuKey }), [activeMenuKey]);

  return (
    <HeaderPcMenuContext.Provider value={menuContext}>
      <ul className={styles.globalNav}>{children}</ul>
    </HeaderPcMenuContext.Provider>
  );
};

interface HeaderPcMenuItemProps {
  readonly menuKey: HeaderPcMenuKey;
  readonly href: string;
  readonly dataClickLabel: string;
  readonly label: string;
  readonly badge?: ReactNode;
  readonly children: ReactNode;
}

const ExpandMoreIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
  </svg>
);

export const HeaderPcMenuItem = ({
  menuKey,
  href,
  dataClickLabel,
  label,
  badge,
  children,
}: HeaderPcMenuItemProps) => {
  const menuContext = useContext(HeaderPcMenuContext);
  const [localActiveMenuKey, setLocalActiveMenuKey] = useState<HeaderPcMenuKey | null>(null);
  const activeMenuKey = menuContext?.activeMenuKey ?? localActiveMenuKey;
  const setActiveMenuKey = menuContext?.setActiveMenuKey ?? setLocalActiveMenuKey;
  const openMenu = useCallback(() => {
    setActiveMenuKey(menuKey);
  }, [menuKey, setActiveMenuKey]);
  const closeMenu = useCallback(() => {
    setActiveMenuKey(null);
  }, [setActiveMenuKey]);
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        closeMenu();
      }
    },
    [closeMenu],
  );
  const isActive = activeMenuKey === menuKey;
  const hasBadge = badge !== undefined && badge !== null;
  const link = (
    <Link
      href={href}
      data-click-label={dataClickLabel}
      className={styles.link}
      aria-haspopup="true"
      aria-expanded={isActive}
    >
      {label}
      <ExpandMoreIcon />
    </Link>
  );

  return (
    <li className={`${styles.menu} ${isActive ? styles.isOpen : ""}`}>
      <div
        className={styles.menuContent}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        onFocus={openMenu}
        onBlur={handleBlur}
      >
        {hasBadge ? (
          <div className={styles.labelLinkWrapper}>
            {badge}
            {link}
          </div>
        ) : (
          link
        )}
        {children}
      </div>
    </li>
  );
};
