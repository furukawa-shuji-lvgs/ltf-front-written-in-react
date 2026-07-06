import { SearchPanel, Section } from "@features/legacyVrt/components/LegacyVrtPageParts.tsx";
import {
  LegacyFeatureGrid,
  LegacyInfoTable,
  legacyTechnologies,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import Link from "next/link";
import { getProjectSummaries, type ProjectSummary } from "../api/projectSummaries.ts";

const ProjectCard = ({ project }: { project: ProjectSummary }) => (
  <article className={styles.projectCard}>
    <h3>{project.title}</h3>
    <p>{project.price}</p>
    <ul>
      {project.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
    <Link href={project.detailPath}>詳細を見る</Link>
  </article>
);

const ProjectCardList = ({ projects }: { projects: ProjectSummary[] }) => (
  <div className={styles.projectCardList}>
    {projects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
      />
    ))}
  </div>
);

const ProjectSearchBody = () => (
  <section className={styles.projectSearchPage}>
    <div className={styles.searchModeTabs}>
      <span>こだわり検索</span>
      <span>AI検索（β機能）</span>
    </div>
    <div className={styles.searchWizard}>
      <aside>
        <div className={styles.personIcon} />
        <strong>0</strong>
        <span>件</span>
      </aside>
      <div className={styles.wizardMain}>
        <ol className={styles.filterSteps}>
          {[
            "職種",
            "スキル・言語",
            "リモート・地域",
            "週稼働日",
            "単価",
            "条件",
            "フリーワード",
          ].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className={styles.filterLead}>まずは、ご経験のある職種をお選びください</div>
        <div className={styles.checkboxPanel}>
          {["サーバーサイドエンジニア", "フロントエンドエンジニア", "インフラエンジニア"].map(
            (label) => (
              <label key={label}>
                <input type="checkbox" />
                {label}
              </label>
            ),
          )}
        </div>
        <button
          className={styles.disabledButton}
          type="button"
        >
          現在までの条件で検索
        </button>
      </div>
    </div>
  </section>
);

const ProjectListBody = ({ paged }: { paged: boolean }) => (
  <section className={styles.projectListPage}>
    <div className={styles.contentInner}>
      <SearchPanel id="project-list-keyword" />
      <div className={styles.projectLayout}>
        <aside className={styles.sideFilter}>
          <h2>条件で絞り込む</h2>
          {["職種", "スキル", "勤務地", "単価", "稼働日数"].map((title) => (
            <div
              key={title}
              className={styles.filterBlock}
            >
              <h3>{title}</h3>
              {legacyTechnologies.slice(0, 4).map((item) => (
                <label key={`${title}-${item}`}>
                  <input type="checkbox" />
                  {item}
                </label>
              ))}
            </div>
          ))}
        </aside>
        <div className={styles.projectResults}>
          <h2>{paged ? "新着案件一覧" : "おすすめ案件一覧"}</h2>
          <ProjectCardList projects={getProjectSummaries({ count: paged ? 8 : 5 })} />
        </div>
      </div>
    </div>
  </section>
);

const ProjectClosedBody = ({ paged }: { paged: boolean }) => (
  <section className={styles.closedProjectPage}>
    <div className={styles.contentInner}>
      <h2>募集終了の求人・案件一覧</h2>
      <p className={styles.centerLead}>
        非公開求人・案件をご希望の方は、無料登録後に担当者へご相談ください。
      </p>
      <ProjectCardList projects={getProjectSummaries({ count: paged ? 4 : 3, status: "closed" })} />
      <div className={styles.closedProjectSpacer}>
        <div className={styles.pagination}>1　2</div>
      </div>
    </div>
  </section>
);

const ProjectDetailBody = () => (
  <>
    <section className={styles.detailHeader}>
      <div className={styles.contentInner}>
        <p className={styles.badge}>商談中1件</p>
        <h2>Java/Spring Bootを用いた基幹システム開発案件</h2>
        <div className={styles.priceBox}>
          <span>単価</span>
          <strong>〜850,000円/月</strong>
        </div>
      </div>
    </section>
    <Section title="案件詳細">
      <LegacyInfoTable />
    </Section>
    <Section
      title="必要なスキル"
      tone="blue"
    >
      <LegacyFeatureGrid count={4} />
    </Section>
    <Section title="おすすめポイント">
      <LegacyFeatureGrid count={6} />
    </Section>
    <Section
      title="関連案件"
      tone="blue"
    >
      <ProjectCardList projects={getProjectSummaries({ count: 4 })} />
    </Section>
  </>
);

const ProjectUndecidedBody = () => (
  <main className={styles.undecidedMain}>
    <section className={styles.undecidedHero}>
      <h1>ひとつの案件に決めずとも、複数の案件にご応募いただくことができます</h1>
    </section>
    <section className={styles.undecidedCard}>
      <p>ご覧になった案件と条件の近い案件は</p>
      <strong>42件あります</strong>
      <ProjectCardList projects={getProjectSummaries({ count: 1 })} />
    </section>
    <section className={styles.undecidedCta}>
      <h2>ご希望にマッチした案件を専門のコーディネーターがお探しいたします</h2>
      <button type="button">お問い合わせはこちら</button>
    </section>
    <div className={styles.standaloneLogo}>レバテック</div>
  </main>
);

export const ProjectLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  const { definition } = match;

  if (definition.id === "project-undecided") return <ProjectUndecidedBody />;
  if (definition.id === "project-search") return <ProjectSearchBody />;
  if (definition.id === "project-detail-id") return <ProjectDetailBody />;
  if (definition.id === "project-closedsearch" || definition.id === "project-closedsearch-ppage") {
    return <ProjectClosedBody paged={definition.id.includes("ppage")} />;
  }

  return (
    <ProjectListBody
      paged={definition.id.includes("ppage") || definition.id === "project-search-ppage"}
    />
  );
};
