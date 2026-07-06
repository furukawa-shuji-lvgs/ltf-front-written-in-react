import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch, RouteFeature } from "@features/routeCatalog/types.ts";
import { FooterPc } from "@shared/components/FooterPc/FooterPc.tsx";
import { FooterSp } from "@shared/components/FooterSp/FooterSp.tsx";
import { HeaderPc } from "@shared/components/HeaderPc/HeaderPc.tsx";
import { HeaderSp } from "@shared/components/HeaderSp/HeaderSp.tsx";
import { getRuntimeEnv } from "@shared/lib/runtimeEnv.ts";
import type { ReactNode } from "react";
import { visualStyleFor } from "../api/visualProfiles.ts";
import { Actions, classNames, RouteParams, SearchPanel } from "./LegacyVrtPageParts.tsx";

export interface LegacyVrtPageShellProps {
  match: PageRouteMatch;
  children: ReactNode;
}

const featureLabels = {
  achievement: "利用者インタビュー",
  consultation: "キャリア相談",
  entry: "応募",
  friend: "紹介",
  guide: "フリーランスガイド",
  information: "サイト情報",
  maintenance: "メンテナンス",
  member: "会員登録",
  project: "案件検索",
  service: "サービス",
  top: "レバテックフリーランス",
  word: "IT用語集",
} satisfies Record<RouteFeature, string>;

const isLegacyVisualRun = getRuntimeEnv("E2E_LEGACY_VISUAL") === "true";

const shouldUseCompactSpFooter = (match: PageRouteMatch): boolean => {
  const { definition } = match;
  if (definition.id === "women") return false;
  if (["achievement", "friend", "guide", "information", "word"].includes(definition.feature)) {
    return true;
  }

  return [
    "project-closedsearch",
    "project-closedsearch-ppage",
    "service-first-freelance",
    "service-merit-accountant-1",
    "service-onsite",
    "service-phone",
    "service-platform",
  ].includes(definition.id);
};

const Hero = ({ match }: { match: PageRouteMatch }) => {
  const { definition } = match;
  if (definition.feature === "top") {
    return (
      <section className={`${styles.hero} ${styles.topHero}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>業界認知度No.1</p>
            <h1>{definition.title}</h1>
            <p>{definition.description}</p>
            <Actions match={match} />
          </div>
          <div className={styles.heroSearchCard}>
            <p>案件数110,000件以上</p>
            <SearchPanel />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{featureLabels[definition.feature]}</p>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
          <RouteParams params={match.params} />
          <Actions match={match} />
        </div>
      </div>
    </section>
  );
};

const LegacyHeader = ({ match }: { match: PageRouteMatch }) => (
  <>
    <div className={styles.pcOnly}>
      <HeaderPc
        h1="VRT Mock"
        isP={true}
      />
    </div>
    <div className={styles.spOnly}>
      <HeaderSp />
    </div>
    <Hero match={match} />
  </>
);

const LegacyFooter = () => (
  <>
    <div className={styles.pcOnly}>
      <FooterPc />
    </div>
    <div className={styles.spOnly}>
      <FooterSp />
    </div>
  </>
);

export const LegacyVrtPageShell = ({ match, children }: LegacyVrtPageShellProps) => {
  const { definition } = match;
  const style = visualStyleFor(match);
  const vrtHeightClass = isLegacyVisualRun && styles.vrtFixedHeight;

  if (definition.id === "project-undecided") {
    return (
      <div
        className={classNames(styles.shell, styles.standaloneShell, vrtHeightClass)}
        style={style}
      >
        {children}
      </div>
    );
  }

  if (definition.id === "service-assess" || definition.id === "service-assess-complete") {
    return (
      <div
        className={classNames(styles.shell, styles.standaloneShell, vrtHeightClass)}
        style={style}
      >
        {children}
      </div>
    );
  }

  if (definition.layout === "maintenance") {
    return (
      <div
        className={classNames(styles.shell, styles.maintenanceShell, vrtHeightClass)}
        style={style}
      >
        {children}
      </div>
    );
  }

  if (definition.layout === "form") {
    return (
      <div
        className={classNames(styles.shell, styles.formShell, vrtHeightClass)}
        style={style}
      >
        {children}
      </div>
    );
  }

  if (definition.feature === "friend") {
    return (
      <div
        className={classNames(styles.shell, styles.standaloneShell, vrtHeightClass)}
        style={style}
      >
        <main className={styles.main}>{children}</main>
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.shell, vrtHeightClass)}
      data-feature={definition.feature}
      data-page-id={definition.id}
      data-compact-sp-footer={shouldUseCompactSpFooter(match) ? "true" : undefined}
      style={style}
    >
      <LegacyHeader match={match} />
      <main className={styles.main}>{children}</main>
      <LegacyFooter />
    </div>
  );
};
