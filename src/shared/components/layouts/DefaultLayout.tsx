import { FooterPc } from "@shared/components/FooterPc/FooterPc.tsx";
import { FooterSp } from "@shared/components/FooterSp/FooterSp.tsx";
import { HeaderPc } from "@shared/components/HeaderPc/HeaderPc.tsx";
import { HeaderSp } from "@shared/components/HeaderSp/HeaderSp.tsx";
import { getDevice } from "@shared/lib/device.ts";
import type { ReactNode } from "react";
import styles from "./DefaultLayout.module.scss";

export interface DefaultLayoutProps {
  /** TDKH の h1（移行元では layout 内で getTdkh していたが、ページ側で取得して渡す） */
  h1: string;
  /** h1 タグではなく p タグで見出しを表示するか（旧 route.meta.isP 相当） */
  isP?: boolean;
  children: ReactNode;
}

// 移行元: app/layouts/default.vue
// TDKH の取得・メタタグ設定は各ページの generateMetadata（@shared/lib/pageMeta）で行う
export const DefaultLayout = async ({ h1, isP = false, children }: DefaultLayoutProps) => {
  const device = await getDevice();

  if (device !== "sp") {
    return (
      <div>
        <HeaderPc
          h1={h1}
          isP={isP}
        />
        <HeaderPc
          h1={h1}
          isFixed={true}
        />
        {children}
        <FooterPc />
      </div>
    );
  }

  return (
    <div>
      {isP ? <p className={styles.h1Title}>{h1}</p> : <h1 className={styles.h1Title}>{h1}</h1>}
      <HeaderSp />
      {children}
      <FooterSp />
    </div>
  );
};
