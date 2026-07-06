import type { BreadCrumb } from "@shared/api/seo/types.ts";
import { imageUrl } from "@shared/lib/image.ts";
import Link from "next/link";
import styles from "./BreadcrumbsPc.module.scss";

export interface BreadcrumbsPcProps {
  breadcrumbs: BreadCrumb[];
  size?: "-layout-l" | ""; // ヘッダーの横幅を1024pxに改修後は不要
}

// schema.org/BreadcrumbList の microdata 構造化データを含む（移行元と同じ）
export const BreadcrumbsPc = ({ breadcrumbs, size = "" }: BreadcrumbsPcProps) => (
  <ol
    className={`${styles.breadcrumbList} ${size === "-layout-l" ? styles.layoutL : ""}`}
    style={
      {
        "--icon-arrow": `url("${imageUrl("/common/icon_arrow_black.png")}")`,
      } as React.CSSProperties
    }
    itemScope={true}
    itemType="https://schema.org/BreadcrumbList"
  >
    {breadcrumbs.map((breadcrumb, index) => (
      <li
        key={breadcrumb.url}
        className={styles.item}
        itemProp="itemListElement"
        itemScope={true}
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
