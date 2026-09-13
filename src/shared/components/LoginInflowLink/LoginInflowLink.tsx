"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useCallback } from "react";

import { postLoginInflowInfo } from "@shared/lib/loginInflow.ts";

export interface LoginInflowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string;
  readonly children: ReactNode;
}

export const LoginInflowLink = ({
  href,
  onClick,
  children,
  ...props
}: Readonly<LoginInflowLinkProps>) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      // oxlint-disable-next-line promise/prefer-await-to-then -- 遷移や描画を待たせずに送信し、通信失敗だけを吸収する。
      void postLoginInflowInfo(href).catch(() => {});
    },
    [href, onClick],
  );
  return (
    <a
      {...props}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
