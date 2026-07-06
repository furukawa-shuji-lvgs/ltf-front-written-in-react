"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface HeaderPcShellClientProps {
  children: ReactNode;
  isFixed: boolean;
  isSticky: boolean;
  isLayoutL: boolean;
  classNames: {
    baseHeader: string;
    isFixed: string;
    isShow: string;
    isSticky: string;
    layoutL: string;
  };
}

export const HeaderPcShellClient = ({
  children,
  isFixed,
  isSticky,
  isLayoutL,
  classNames,
}: HeaderPcShellClientProps) => {
  const [isShow, setIsShow] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isFixed) return;

    const updateHeaderVisibility = () => {
      setIsShow(window.scrollY >= (isSticky ? window.innerHeight : 600));
      animationFrameRef.current = null;
    };

    const toggleHeaderNav = () => {
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(updateHeaderVisibility);
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", toggleHeaderNav, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleHeaderNav);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFixed, isSticky]);

  const headerClass = [
    classNames.baseHeader,
    isFixed ? classNames.isFixed : "",
    isShow ? classNames.isShow : "",
    isSticky ? classNames.isSticky : "",
    isLayoutL ? classNames.layoutL : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <header className={headerClass}>{children}</header>;
};
