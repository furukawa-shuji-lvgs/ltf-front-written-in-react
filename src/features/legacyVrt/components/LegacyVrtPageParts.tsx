import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import Link from "next/link";
import type { ReactNode } from "react";

const paramLabels: Record<string, string> = {
  category1: "カテゴリ",
  category2: "追加カテゴリ",
  id: "ID",
  page: "ページ",
  tagId: "タグ",
};

export const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const RouteParams = ({ params }: { params: PageRouteMatch["params"] }) => {
  const entries = Object.entries(params);
  if (entries.length === 0) return null;

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

export const SearchPanel = () => (
  <form
    className={styles.searchPanel}
    action="/project/search/"
    method="get"
  >
    <label
      className={styles.searchLabel}
      htmlFor="keyword"
    >
      キーワードで案件を探す
    </label>
    <div className={styles.searchControls}>
      <input
        id="keyword"
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
);

export const Actions = ({ match }: { match: PageRouteMatch }) => (
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
  title: string;
  children: ReactNode;
  tone?: "white" | "blue" | "gray";
}) => (
  <section className={`${styles.sectionBand} ${styles[tone]}`}>
    <div className={styles.contentInner}>
      <h2>{title}</h2>
      {children}
    </div>
  </section>
);
