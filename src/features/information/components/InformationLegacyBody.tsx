import {
  LegacyArticleBody,
  legacyHelpGroups,
  legacySitemapLinkItems,
} from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import Link from "next/link";

const SitemapBody = () => (
  <section className={styles.sitemapPage}>
    <div className={styles.contentInner}>
      <h2>サイトマップ</h2>
      <div className={styles.sitemapGrid}>
        {legacySitemapLinkItems.map((link) => (
          <Link
            key={link.id}
            href="/sitemap/"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const HelpResponsiveBody = ({ match }: { match: PageRouteMatch }) => (
  <>
    <LegacyArticleBody match={match} />
    <div className={styles.spReplacement}>
      <HelpSpBody />
    </div>
  </>
);

const HelpSpBody = () => (
  <section className={styles.helpSpPage}>
    <div className={styles.contentInner}>
      <nav className={styles.helpMenu}>
        {["レバテックフリーランスについて", ...legacyHelpGroups].map((item) => (
          <a
            key={item}
            href="#help"
          >
            {item}
          </a>
        ))}
      </nav>
      {legacyHelpGroups.map((group) => (
        <section
          key={group}
          className={styles.helpGroup}
        >
          <h2>{group}</h2>
          {[1, 2, 3, 4].map((index) => (
            <details key={`${group}-${index}`}>
              <summary>{group}に関するよくある質問ですか？</summary>
            </details>
          ))}
        </section>
      ))}
      <p className={styles.helpNotice}>
        ヘルプを読んでも解決しない場合は、お問い合わせフォームまたはお電話にてご連絡ください。
      </p>
    </div>
  </section>
);

export const InformationLegacyBody = ({ match }: { match: PageRouteMatch }) => {
  if (match.definition.id === "sitemap") return <SitemapBody />;
  if (match.definition.id === "help") return <HelpResponsiveBody match={match} />;

  return <LegacyArticleBody match={match} />;
};
