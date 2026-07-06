import {
  Actions,
  SearchPanel,
  Section,
} from "@features/legacyVrt/components/LegacyVrtPageParts.tsx";
import {
  LegacyFeatureGrid,
  LegacyProjectCardGrid,
  LegacyStepList,
  legacyLocations,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const TopLegacyBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <section className={styles.assessBand}>
      <div className={styles.contentInner}>
        <p className={styles.centerLead}>あなたの希望に合わせて案件を探せます</p>
        <div className={styles.questionBox}>
          {legacyLocations.slice(0, 4).map((label) => (
            <label key={label}>
              <input type="checkbox" />
              {label}
            </label>
          ))}
          <button type="button">次へ</button>
        </div>
      </div>
    </section>
    <Section
      title="どんな案件をお探しですか？"
      tone="blue"
    >
      <SearchPanel
        id="top-body-keyword"
        inputLabel="本文検索"
      />
      <LegacyProjectCardGrid />
    </Section>
    <Section title="レバテックフリーランスが選ばれる理由">
      <LegacyFeatureGrid count={6} />
    </Section>
    <Section
      title="登録者限定「マイページ機能」"
      tone="blue"
    >
      <LegacyFeatureGrid count={3} />
      <Actions match={match} />
    </Section>
    <Section title="ご利用の流れ">
      <LegacyStepList />
    </Section>
    <Section
      title="希望に合った案件を探す"
      tone="blue"
    >
      <LegacyProjectCardGrid />
    </Section>
  </>
);
