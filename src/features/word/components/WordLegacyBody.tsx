import {
  LegacyProjectCardList,
  legacyTechnologies,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import Link from "next/link";

const WordBody = () => (
  <section className={styles.wordPage}>
    <div className={styles.contentInner}>
      <h2>おすすめキーワード</h2>
      <p>
        フリーエンジニアに特化した求人・案件情報を探すならレバテックフリーランス。よく検索されるキーワードを掲載しています。
      </p>
      <div className={styles.keywordGrid}>
        {legacyTechnologies.map((technology) => (
          <Link
            key={technology}
            href="/word/list/1/"
          >
            {technology}
          </Link>
        ))}
      </div>
      <div className={styles.pagination}>1　2　3</div>
    </div>
  </section>
);

const WordListResponsiveBody = ({ paged }: { paged: boolean }) => (
  <>
    <WordBody />
    <div className={styles.spReplacement}>
      <WordListSpBody paged={paged} />
    </div>
  </>
);

const WordListSpBody = ({ paged }: { paged: boolean }) => (
  <section className={styles.wordListSpPage}>
    <div className={styles.contentInner}>
      <h2>の求人・案件一覧</h2>
      <div className={styles.quickSearchBox}>の案件を検索してみる</div>
      <button
        className={styles.redCta}
        type="button"
      >
        簡単30秒！無料登録
      </button>
      <p className={styles.centerLead}>該当件数：21件</p>
      <LegacyProjectCardList count={3} />
      <section className={styles.marketBanner}>
        <h3>自分の市場価値を把握しましょう</h3>
        <p>スキル別市場分析ダッシュボード</p>
        <button type="button">市場価値をチェック</button>
      </section>
      <div className={styles.pagination}>{paged ? "1　2　3" : "1　2"}</div>
      <section className={styles.otherKeywords}>
        <h3>他のキーワードから案件を探す</h3>
        {legacyTechnologies.slice(0, 3).map((technology) => (
          <Link
            key={technology}
            href="/word/list/1/"
          >
            {technology} 関連項目
          </Link>
        ))}
      </section>
    </div>
  </section>
);

export const WordLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  const { definition } = match;

  if (definition.id === "word-list-id" || definition.id === "word-list-id-ppage") {
    return <WordListResponsiveBody paged={definition.id.includes("ppage")} />;
  }

  return <WordBody />;
};
