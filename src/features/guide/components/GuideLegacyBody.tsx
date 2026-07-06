import {
  LegacyGuideListBody,
  LegacyProjectCardList,
  legacyArticleItems,
  legacyStartGuideCards,
  legacyStartGuideSteps,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

const StartGuideBody = () => (
  <section className={styles.startGuidePage}>
    <div className={styles.startGuideHero}>
      <div className={styles.contentInner}>
        <p>〜フリーランスになるには？何から始める？〜</p>
        <h2>フリーランススタートガイド</h2>
        <div className={styles.startGuideFaqs}>
          {[
            "そもそもフリーランスって？",
            "準備・案件などの不安",
            "案件はどうやって探せばいい？",
            "契約の流れ、単価交渉、参画中のヒント",
            "確定申告の準備とチェックポイント",
          ].map((item) => (
            <button
              key={item}
              type="button"
            >
              {item}
              <span>+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className={styles.startGuideIntro}>
      <p>
        やることリストをステップごとにご紹介！
        <br />
        ぜひブックマークしてご活用ください。
      </p>
    </div>
    <div className={styles.contentInner}>
      <h2>フリーランスになるための5ステップ</h2>
      <div className={styles.startGuideSteps}>
        {legacyStartGuideSteps.map((step, index) => (
          <article key={step}>
            <span>STEP {String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>フリーランスとして働く前に確認したい情報を、流れに沿ってまとめています。</p>
          </article>
        ))}
      </div>
    </div>
    <div className={styles.startGuideCta}>
      <div className={styles.contentInner}>
        <h2>フリーランスに対して不安をお持ちの方へ</h2>
        <p>希望条件や経験をもとに、担当者が案件探しをサポートします。</p>
        <button type="button">案件を相談してほしい</button>
        <button type="button">まずは話を聞きたい</button>
      </div>
    </div>
    <div className={styles.startGuideService}>
      <div className={styles.contentInner}>
        <p>エージェントに何を相談したらいい？</p>
        <h2>レバテックフリーランスエージェントだからできること</h2>
        <div className={styles.startGuideCards}>
          {legacyStartGuideCards.map((card) => (
            <article key={card}>
              <div className={styles.startGuideIllustration} />
              <h3>{card}</h3>
              <button type="button">詳しく見る</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const StartGuideResponsiveBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <LegacyGuideListBody match={match} />
    <div className={styles.startGuideSpOnly}>
      <StartGuideBody />
    </div>
  </>
);

const GuideDetailResponsiveBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <LegacyGuideListBody match={match} />
    <div className={styles.spReplacement}>
      <GuideDetailSpBody />
    </div>
  </>
);

const GuideDetailSpBody = () => (
  <article className={styles.guideDetailSpPage}>
    <div className={styles.contentInner}>
      <h2>フリーランスエンジニアが案件を選ぶときのチェックポイント</h2>
      <p className={styles.dateText}>2026年7月4日</p>
      <div className={styles.tagRow}>
        {["フリーランス", "案件選び"].map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p>
        案件の単価だけでなく、作業範囲、期待役割、契約条件、参画後のコミュニケーションを確認することで、参画後のミスマッチを減らしやすくなります。
      </p>
      <section className={styles.authorCard}>
        <div>profile image</div>
        <h3>記事の監修者</h3>
        <p>レバテックフリーランス編集部。フリーランス支援サービスの知見をもとに解説します。</p>
      </section>
      {["案件内容と役割を確認する", "契約条件を事前に把握する", "参画後のサポート体制を見る"].map(
        (title) => (
          <section
            key={title}
            className={styles.articleBlock}
          >
            <h3>{title}</h3>
            <p>
              担当範囲、利用技術、チーム体制、リモート可否などを確認し、自分の経験と希望条件に合うかを見極めましょう。
            </p>
          </section>
        ),
      )}
      <button
        className={styles.redCta}
        type="button"
      >
        情報収集から相談してみる
      </button>
      <section className={styles.compactArticleList}>
        <h3>新着記事</h3>
        {legacyArticleItems.slice(0, 3).map((item) => (
          <article key={item.id}>
            <div className={styles.smallThumb}>Frontend</div>
            <p>{item.title}</p>
          </article>
        ))}
      </section>
      <section className={styles.compactArticleList}>
        <h3>関連案件</h3>
        <LegacyProjectCardList count={3} />
      </section>
    </div>
  </article>
);

export const GuideLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  if (match.definition.id === "guide-freelance-start-guide") {
    return <StartGuideResponsiveBody match={match} />;
  }
  if (match.definition.id === "guide-detail-id") return <GuideDetailResponsiveBody match={match} />;

  return <LegacyGuideListBody match={match} />;
};
