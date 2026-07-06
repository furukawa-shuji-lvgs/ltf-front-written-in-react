import { profileFor } from "@features/legacyVrt/api/visualProfiles.ts";
import { Section } from "@features/legacyVrt/components/LegacyVrtPageParts.tsx";
import {
  LegacyArticleGrid,
  LegacyFaqList,
  LegacyFeatureGrid,
  LegacyProjectCardList,
  LegacyStepList,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

const ServiceBody = ({ match }: { match: PageRouteMatch }) => {
  const longPage = profileFor(match).pc > 7000;
  const pickup = match.definition.id === "service-pickup";

  return (
    <>
      <Section title="サービスの特徴">
        <LegacyFeatureGrid count={pickup ? 9 : 6} />
      </Section>
      <Section
        title="フリーランス支援の内容"
        tone="blue"
      >
        <LegacyStepList />
      </Section>
      <Section title="ご利用者の声">
        <LegacyArticleGrid count={longPage ? 9 : 6} />
      </Section>
      <Section
        title="よくある質問"
        tone="blue"
      >
        <LegacyFaqList count={longPage ? 8 : 4} />
      </Section>
      {longPage && (
        <>
          <Section title="働き方のメリット">
            <LegacyFeatureGrid count={9} />
          </Section>
          <Section
            title="関連サービス"
            tone="blue"
          >
            <LegacyArticleGrid count={9} />
          </Section>
        </>
      )}
    </>
  );
};

const ServiceResponsiveBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <ServiceBody match={match} />
    <div className={styles.spReplacement}>
      {match.definition.id === "service-phone" ? <ServicePhoneSpBody /> : <ServiceOnsiteSpBody />}
    </div>
  </>
);

const ServicePhoneSpBody = () => (
  <section className={styles.phoneSpPage}>
    <div className={styles.contentInner}>
      <h2>電話番号</h2>
      <p>以下は、レバテックフリーランスの電話番号です。ご状況に合わせてお問い合わせください。</p>
      <div className={styles.phoneNumberBox}>
        {["0120905825", "0120546041", "0120546043", "05055367300", "0345418433"].map((number) => (
          <a
            key={number}
            href={`tel:${number}`}
          >
            {number}
          </a>
        ))}
        <small>営業時間 平日9:00〜18:00</small>
      </div>
      <h2>お電話の内容</h2>
      <div className={styles.phoneCards}>
        {["現在のご状況のお伺い", "新しい案件や最新状況のご案内"].map((title) => (
          <article key={title}>
            <div className={styles.serviceIllustration} />
            <h3>{title}</h3>
            <p>希望条件や参画状況に合わせて、担当者からご連絡します。</p>
          </article>
        ))}
      </div>
      <h2>ご利用の流れ</h2>
      <LegacyStepList />
    </div>
  </section>
);

const ServiceOnsiteSpBody = () => (
  <section className={styles.onsiteSpPage}>
    <div className={styles.onsiteHero}>
      <div className={styles.contentInner}>
        <h2>企業で経験を積みたい方へ</h2>
        <p>レバテックの常駐型フリーランス支援</p>
      </div>
    </div>
    <div className={styles.contentInner}>
      <section className={styles.onsiteLead}>
        <h2>常駐案件の特徴</h2>
        <p>チーム開発、上流工程、長期参画など、経験を広げやすい案件を多数扱っています。</p>
      </section>
      <section className={styles.onsiteLinkBox}>
        {[1, 2, 3, 4, 5].map((item) => (
          <a
            key={item}
            href="#onsite"
          >
            常駐案件のサポート内容 {item}
          </a>
        ))}
      </section>
      {[
        "常駐案件のメリット",
        "フリーランス支援の内容",
        "参画までの流れ",
        "参画中のフォロー",
        "利用者の声",
      ].map((title) => (
        <section
          key={title}
          className={styles.onsiteSection}
        >
          <h2>{title}</h2>
          <div className={styles.onsiteCardGrid}>
            {[1, 2, 3].map((index) => (
              <article key={`${title}-${index}`}>
                <div className={styles.serviceIllustration} />
                <h3>
                  {title} {index}
                </h3>
                <p>案件提案から条件調整、参画後の相談まで担当者がサポートします。</p>
              </article>
            ))}
          </div>
        </section>
      ))}
      <button
        className={styles.redCta}
        type="button"
      >
        無料で相談してみる
      </button>
      <section className={styles.compactArticleList}>
        <h3>おすすめ案件</h3>
        <LegacyProjectCardList count={3} />
      </section>
    </div>
  </section>
);

const ServiceAssessBody = ({ complete }: { complete: boolean }) => (
  <main className={complete ? styles.assessCompleteMain : styles.assessMain}>
    <section className={styles.assessHero}>
      <h1>{complete ? "診断結果" : "フリーランスエンジニア 単価診断"}</h1>
      <p>{complete ? "あなたの想定単価は 820,000円/月" : "今のスキルでいくらになる？"}</p>
      <button type="button">{complete ? "案件を探してみる" : "診断スタート（登録不要）"}</button>
    </section>
    {complete && (
      <>
        <section className={styles.assessResultCard}>
          <h2>ご提案できる案件例</h2>
          <LegacyProjectCardList count={2} />
        </section>
        <section className={styles.assessCta}>
          <h2>Java経験を活かせる高単価案件を確認しましょう</h2>
          <button type="button">案件を探してみる</button>
        </section>
      </>
    )}
  </main>
);

export const ServiceLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  const { definition } = match;

  if (definition.id === "service-assess" || definition.id === "service-assess-complete") {
    return <ServiceAssessBody complete={definition.id === "service-assess-complete"} />;
  }
  if (definition.id === "service-onsite" || definition.id === "service-phone") {
    return <ServiceResponsiveBody match={match} />;
  }

  return <ServiceBody match={match} />;
};
