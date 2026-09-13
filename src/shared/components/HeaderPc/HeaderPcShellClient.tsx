"use client";

import type { ReactNode } from "react";

import { useEffect, useRef, useState } from "react";

const fixedHeaderThresholdPx = 600;

interface HeaderPcShellClientProps {
  readonly children: ReactNode;
  readonly isFixed: boolean;
  readonly isSticky: boolean;
  readonly isLayoutL: boolean;
  readonly classNames: {
    readonly baseHeader: string;
    readonly isFixed: string;
    readonly isShow: string;
    readonly isSticky: string;
    readonly layoutL: string;
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
    if (!isFixed) {
      return;
    }

    const updateHeaderVisibility = () => {
      setIsShow(window.scrollY >= (isSticky ? window.innerHeight : fixedHeaderThresholdPx));
      animationFrameRef.current = null;
    };

    const toggleHeaderNav = () => {
      if (animationFrameRef.current !== null) {
        return;
      }
      animationFrameRef.current = globalThis.requestAnimationFrame(updateHeaderVisibility);
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", toggleHeaderNav, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleHeaderNav);
      if (animationFrameRef.current !== null) {
        globalThis.cancelAnimationFrame(animationFrameRef.current);
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
