"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import styles from "./HeaderPc.module.scss";
import type { CommonNavData } from "./types.ts";

type HeaderPcMenuKey = "project" | CommonNavData["menuKey"];

interface HeaderPcMenuContextValue {
  activeMenuKey: HeaderPcMenuKey | null;
  setActiveMenuKey: (menuKey: HeaderPcMenuKey | null) => void;
}

const HeaderPcMenuContext = createContext<HeaderPcMenuContextValue | null>(null);

export const HeaderPcMenuList = ({ children }: { children: ReactNode }) => {
  const [activeMenuKey, setActiveMenuKey] = useState<HeaderPcMenuKey | null>(null);

  return (
    <HeaderPcMenuContext.Provider value={{ activeMenuKey, setActiveMenuKey }}>
      <ul className={styles.globalNav}>{children}</ul>
    </HeaderPcMenuContext.Provider>
  );
};

interface HeaderPcMenuItemProps {
  menuKey: HeaderPcMenuKey;
  href: string;
  dataClickLabel: string;
  label: string;
  badge?: ReactNode;
  children: ReactNode;
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
    <li
      className={`${styles.menu} ${isActive ? styles.isOpen : ""}`}
      onMouseEnter={() => setActiveMenuKey(menuKey)}
      onMouseLeave={() => setActiveMenuKey(null)}
      onFocus={() => setActiveMenuKey(menuKey)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setActiveMenuKey(null);
        }
      }}
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
    </li>
  );
};
