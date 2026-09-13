import type { ReactNode } from "react";

import Link from "next/link";

import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";

const paramLabels: Readonly<Record<string, string>> = {
  category1: "カテゴリ",
  category2: "追加カテゴリ",
  id: "ID",
  page: "ページ",
  tagId: "タグ",
};

export const classNames = (...classes: readonly (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const RouteParams = ({ params }: { readonly params: PageRouteMatch["params"] }) => {
  const entries = Object.entries(params);
  if (entries.length === 0) {
    return null;
  }

  return (
    <dl
      className={styles.params}
      aria-label="表示条件"
    >
      {entries.map(([name, value]) => (
        <div
          key={name}
          className={styles.paramItem}
        >
          <dt>{paramLabels[name] ?? name}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
};

export const SearchPanel = ({
  id = "keyword",
  inputLabel,
}: {
  readonly id?: string;
  readonly inputLabel?: string;
}) => (
  <search>
    <form
      className={styles.searchPanel}
      action="/project/search/"
      method="get"
    >
      <label
        className={styles.searchLabel}
        htmlFor={id}
      >
        キーワードで案件を探す
      </label>
      <div className={styles.searchControls}>
        <input
          id={id}
          aria-label={inputLabel}
          className={styles.searchInput}
          name="keyword"
          type="search"
          placeholder="Java リモート"
        />
        <button
          className={styles.searchButton}
          type="submit"
        >
          検索
        </button>
      </div>
    </form>
  </search>
);

export const Actions = ({ match }: { readonly match: PageRouteMatch }) => (
  <div className={styles.actions}>
    {match.definition.actions.map((action) => (
      <Link
        key={`${match.pathname}-${action.href}`}
        className={styles.action}
        href={action.href}
      >
        {action.label}
      </Link>
    ))}
  </div>
);

export const Section = ({
  title,
  children,
  tone = "white",
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly tone?: "white" | "blue" | "gray";
}) => (
  <section className={`${styles.sectionBand} ${styles[tone]}`}>
    <div className={styles.contentInner}>
      <h2>{title}</h2>
      {children}
    </div>
  </section>
);
