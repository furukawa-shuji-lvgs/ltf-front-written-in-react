"use client";

import { postLoginInflowInfo } from "@shared/lib/loginInflow.ts";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface LoginInflowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export const LoginInflowLink = ({ href, onClick, children, ...props }: LoginInflowLinkProps) => (
  <a
    {...props}
    href={href}
    onClick={(event) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      void postLoginInflowInfo(href).catch(() => undefined);
    }}
  >
    {children}
  </a>
);
