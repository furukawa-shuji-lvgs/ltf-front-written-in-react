import type { BreadCrumb } from "@shared/api/seo/types.ts";
import Link from "next/link";
import styles from "./BreadcrumbsSp.module.scss";

export interface BreadcrumbsSpProps {
  breadcrumbs: BreadCrumb[];
  variant?: "-silver" | "";
}

// schema.org/BreadcrumbList の microdata 構造化データを含む（移行元と同じ）
export const BreadcrumbsSp = ({ breadcrumbs, variant = "" }: BreadcrumbsSpProps) => (
  <ol
    className={`${styles.breadcrumbList} ${variant === "-silver" ? styles.silver : ""}`}
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
