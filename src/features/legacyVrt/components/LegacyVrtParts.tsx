import { Section } from "@features/legacyVrt/components/LegacyVrtPageParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import Link from "next/link";
import {
  faqItems,
  featureItems,
  type LegacyProjectCardData,
  legacyArticleItems,
  legacyHelpGroups,
  legacyLocations,
  legacyProjectCards,
  legacyProjectListItems,
  legacySitemapLinkItems,
  legacyStartGuideCards,
  legacyStartGuideSteps,
  legacyTechnologies,
} from "../api/legacyVrtFixtures.ts";

export {
  legacyArticleItems,
  legacyHelpGroups,
  legacyLocations,
  legacySitemapLinkItems,
  legacyStartGuideCards,
  legacyStartGuideSteps,
  legacyTechnologies,
};

export const LegacyArticleBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <Section title={match.definition.sections[0]?.title ?? match.definition.title}>
      <LegacyArticleGrid count={match.definition.id.includes("detail") ? 3 : 9} />
    </Section>
    <Section
      title={match.definition.sections[1]?.title ?? "関連情報"}
      tone="blue"
    >
      <LegacyFeatureGrid count={match.definition.feature === "information" ? 8 : 6} />
    </Section>
    <Section title="おすすめの案件">
      <LegacyProjectCardGrid />
    </Section>
  </>
);

export const LegacyGuideListBody = ({ match }: { match: PageRouteMatch }) => (
  <section className={styles.guideListPage}>
    <div className={styles.contentInner}>
      <div className={styles.guideLayout}>
        <div>
          <h2>
            {match.definition.feature === "achievement"
              ? "利用者インタビュー一覧"
              : "フリーランスに関する記事一覧"}
          </h2>
          {legacyArticleItems.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className={styles.guideArticle}
            >
              <div className={styles.guideThumb}>
                {item.id.endsWith("1") ? "320x180" : "Remote"}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>案件選びやキャリア形成に役立つ情報を、VRT確認用の本文量で表示しています。</p>
              </div>
            </article>
          ))}
          <div className={styles.pagination}>1　2　3</div>
        </div>
        <aside className={styles.tagAside}>
          <h3>タグ一覧</h3>
          {["フリーランス", "案件選び", "リモート", "働き方", "スキルアップ"].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </aside>
      </div>
    </div>
  </section>
);

export const LegacyProjectCardGrid = () => (
  <div className={styles.projectCards}>
    {legacyProjectCards.slice(0, 2).map((project) => (
      <LegacyProjectCard
        key={project.title}
        project={project}
      />
    ))}
  </div>
);

export const LegacyProjectCardList = ({ count }: { count: number }) => (
  <div className={styles.projectCardList}>
    {legacyProjectListItems.slice(0, count).map((item) => (
      <LegacyProjectCard
        key={item.id}
        project={item.project}
      />
    ))}
  </div>
);

const LegacyProjectCard = ({ project }: { project: LegacyProjectCardData }) => (
  <article className={styles.projectCard}>
    <h3>{project.title}</h3>
    <p>{project.price}</p>
    <ul>
      {project.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
    <Link href="/project/detail/1001/">詳細を見る</Link>
  </article>
);

export const LegacyFeatureGrid = ({ count }: { count: number }) => (
  <div className={styles.featureGrid}>
    {featureItems.slice(0, count).map((item) => (
      <article
        key={item.id}
        className={styles.featureCard}
      >
        <div className={styles.featureIcon}>{item.number}</div>
        <h3>{item.title}</h3>
        <p>専任担当者が希望条件を整理し、参画前から参画後まで継続してサポートします。</p>
      </article>
    ))}
  </div>
);

export const LegacyArticleGrid = ({ count }: { count: number }) => (
  <div className={styles.articleGrid}>
    {legacyArticleItems.slice(0, count).map((item) => (
      <article
        key={item.id}
        className={styles.articleCard}
      >
        <div className={styles.articleImage} />
        <h3>{item.title}</h3>
        <p>フリーランスとして働くために知っておきたい基礎知識をまとめています。</p>
      </article>
    ))}
  </div>
);

export const LegacyStepList = () => (
  <ol className={styles.stepList}>
    {["無料会員登録", "案件のご提案", "商談・条件調整", "契約・参画開始", "ご参画中サポート"].map(
      (step, index) => (
        <li key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          <p>担当者が状況に合わせて次のステップをご案内します。</p>
        </li>
      ),
    )}
  </ol>
);

export const LegacyInfoTable = () => (
  <dl className={styles.infoTable}>
    {[
      ["職種", "サーバーサイドエンジニア"],
      ["単価", "〜850,000円/月"],
      ["勤務地", "東京都 / リモート可"],
      ["求めるスキル", "Java, Spring Boot, AWS"],
      ["契約形態", "業務委託"],
    ].map(([term, description]) => (
      <div key={term}>
        <dt>{term}</dt>
        <dd>{description}</dd>
      </div>
    ))}
  </dl>
);

export const LegacyFaqList = ({ count }: { count: number }) => (
  <div className={styles.faqList}>
    {faqItems.slice(0, count).map((item) => (
      <details
        key={item.id}
        open={item.open}
      >
        <summary>サービス利用に料金はかかりますか？</summary>
        <p>登録から案件提案、参画中のフォローまで無料で利用できます。</p>
      </details>
    ))}
  </div>
);

export const LegacyFormBody = ({ match }: { match: PageRouteMatch }) => {
  const isInput = match.definition.id.includes("input");
  const isChat = match.definition.id.includes("chat");

  if (isInput) {
    return (
      <main className={styles.formInputMain}>
        <div className={styles.formInputBox}>
          <h1>サービス利用をご検討いただき、ありがとうございます。</h1>
          <p>引き続き、現在のご状況をお聞かせください</p>
          <button type="button">同意して回答する</button>
          {isChat ? <div className={styles.chatPanel}>チャット形式で質問に回答できます</div> : null}
          <details className={styles.noticeBox}>
            <summary>お申込み時のご注意</summary>
          </details>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.completeMain}>
      <header className={styles.completeHeader}>
        <p>スキル・経験・希望の入力について</p>
      </header>
      <section className={styles.completeCard}>
        <h1>{match.definition.title}</h1>
        <p>{match.definition.description}</p>
        <Link href="/project/search/">案件を探す</Link>
      </section>
      <section className={styles.flowCard}>
        <h2>今後の流れ</h2>
        <LegacyStepList />
      </section>
    </main>
  );
};
