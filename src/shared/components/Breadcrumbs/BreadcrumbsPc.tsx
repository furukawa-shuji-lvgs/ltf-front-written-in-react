import type { CSSProperties } from "react";

import Link from "next/link";

import type { BreadCrumb } from "@shared/api/seo/types.ts";

import { imageUrl } from "@shared/lib/image.ts";

import styles from "./BreadcrumbsPc.module.scss";

export interface BreadcrumbsPcProps {
  readonly breadcrumbs: readonly BreadCrumb[];
  // ヘッダーの横幅を1024pxに改修後は不要
  readonly size?: "-layout-l" | "";
}

const breadcrumbStyle: CSSProperties & Record<`--${string}`, string> = {
  "--icon-arrow": `url("${imageUrl("/common/icon_arrow_black.png")}")`,
};

// Schema.org/BreadcrumbList の microdata 構造化データを含む（移行元と同じ）
export const BreadcrumbsPc = ({ breadcrumbs, size = "" }: BreadcrumbsPcProps) => (
  <ol
    className={`${styles.breadcrumbList} ${size === "-layout-l" ? styles.layoutL : ""}`}
    style={breadcrumbStyle}
    itemScope
    itemType="https://schema.org/BreadcrumbList"
  >
    {breadcrumbs.map((breadcrumb, index) => (
      <li
        key={breadcrumb.url}
        className={styles.item}
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        {index === breadcrumbs.length - 1 ? (
          <span itemProp="name">{breadcrumb.text}</span>
        ) : (
          <Link
            href={breadcrumb.url}
            className={styles.link}
            itemProp="item"
          >
            <span itemProp="name">{breadcrumb.text}</span>
          </Link>
        )}
        <meta
          itemProp="position"
          content={String(index + 1)}
        />
      </li>
    ))}
  </ol>
);
