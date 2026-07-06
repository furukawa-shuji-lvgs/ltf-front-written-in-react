import { Section } from "@features/legacyVrt/components/LegacyVrtPageParts.tsx";
import {
  LegacyFeatureGrid,
  LegacyFormBody,
  LegacyStepList,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

const FriendBody = ({ campaign }: { campaign: boolean }) => (
  <>
    <section className={campaign ? styles.friendCampaignHero : styles.friendHero}>
      <div className={styles.contentInner}>
        <h2>{campaign ? "友人紹介キャンペーン" : "知人紹介サービス"}</h2>
        <p>紹介した方にも、紹介された方にもメリットがあるサポートをご用意しています。</p>
      </div>
    </section>
    <Section
      title="紹介の流れ"
      tone="blue"
    >
      <LegacyStepList />
    </Section>
    <Section title="キャンペーン特典">
      <LegacyFeatureGrid count={6} />
    </Section>
  </>
);

const FriendCpCompleteBody = () => (
  <main className={styles.friendCompleteMain}>
    <div className={styles.friendCompleteLogo}>VRT Mock</div>
    <header className={styles.friendCompleteHeader}>スキル・経験・希望の入力について</header>
    <section className={styles.friendCompleteCard}>
      <p>基本情報のご登録ありがとうございました。</p>
      <h1>スキル・経験・希望を入力して次のステップに進む</h1>
      <div className={styles.triangleDown} />
      <div className={styles.friendCompleteButtons}>
        <button type="button">エンジニアの方はこちら</button>
        <button type="button">クリエイターの方はこちら</button>
      </div>
      <p>
        入力が未完了の場合、ご登録いただいた電話番号宛にご状況確認のご連絡を差し上げる可能性がございます。
      </p>
    </section>
    <section className={styles.friendCompleteFlow}>
      <h2>今後の流れ</h2>
      <LegacyStepList />
    </section>
    <section className={styles.friendCompleteContact}>
      <h2>お問い合わせ</h2>
      <p>
        しばらく経っても完了メールが届かない場合や、3日経っても連絡がない場合はお問い合わせください。
      </p>
      <strong>0120-546-041</strong>
      <small>03-5774-1762</small>
    </section>
    <footer className={styles.friendCompleteFooter}>
      <strong>レバテック</strong>
      <small>&copy; 2017-2026 Levtech Co., Ltd.</small>
    </footer>
  </main>
);

export const FriendLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  if (match.definition.id === "friend-cp-complete") return <FriendCpCompleteBody />;
  if (match.definition.layout === "form") return <LegacyFormBody match={match} />;

  return <FriendBody campaign={match.definition.id === "friend-cp"} />;
};
