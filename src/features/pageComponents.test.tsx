import { AchievementPage } from "@features/achievement/components/AchievementPage.tsx";
import { ConsultationPage } from "@features/consultation/components/ConsultationPage.tsx";
import { EntryPage } from "@features/entry/components/EntryPage.tsx";
import { FriendPage } from "@features/friend/components/FriendPage.tsx";
import { GuidePage } from "@features/guide/components/GuidePage.tsx";
import { InformationPage } from "@features/information/components/InformationPage.tsx";
import { MaintenancePage } from "@features/maintenance/components/MaintenancePage.tsx";
import { MemberPage } from "@features/member/components/MemberPage.tsx";
import { ProjectPage } from "@features/project/components/ProjectPage.tsx";
import { resolvePageRoute } from "@features/routeCatalog/routeMatcher.ts";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { ServicePage } from "@features/service/components/ServicePage.tsx";
import { TopPage } from "@features/top/components/TopPage.tsx";
import { WordPage } from "@features/word/components/WordPage.tsx";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";

type PageCase = {
  feature: string;
  Component: ComponentType<{ match: PageRouteMatch }>;
  segments: string[];
  expectedText: string;
};

const pageCases = [
  {
    feature: "top",
    Component: TopPage,
    segments: [],
    expectedText: "ITフリーランスエンジニアの求人・案件",
  },
  {
    feature: "achievement",
    Component: AchievementPage,
    segments: ["achievement", "interview", "list"],
    expectedText: "利用者インタビュー一覧",
  },
  {
    feature: "consultation",
    Component: ConsultationPage,
    segments: ["consultation", "detail", "1"],
    expectedText: "フリーランス相談詳細",
  },
  {
    feature: "entry",
    Component: EntryPage,
    segments: ["entry", "complete"],
    expectedText: "応募完了",
  },
  {
    feature: "friend",
    Component: FriendPage,
    segments: ["friend"],
    expectedText: "知人紹介サービス",
  },
  {
    feature: "guide",
    Component: GuidePage,
    segments: ["guide"],
    expectedText: "フリーランスに関する記事一覧",
  },
  {
    feature: "information",
    Component: InformationPage,
    segments: ["sitemap"],
    expectedText: "サイトマップ",
  },
  {
    feature: "maintenance",
    Component: MaintenancePage,
    segments: ["maintenance"],
    expectedText: "メンテナンス中です",
  },
  {
    feature: "member",
    Component: MemberPage,
    segments: ["member", "complete"],
    expectedText: "会員登録完了",
  },
  {
    feature: "project",
    Component: ProjectPage,
    segments: ["project", "search"],
    expectedText: "まずは、ご経験のある職種",
  },
  {
    feature: "service",
    Component: ServicePage,
    segments: ["service"],
    expectedText: "サービス紹介",
  },
  {
    feature: "word",
    Component: WordPage,
    segments: ["word"],
    expectedText: "おすすめキーワード",
  },
] as const satisfies readonly PageCase[];

const buildMatch = (segments: string[]): PageRouteMatch => {
  const match = resolvePageRoute(segments);
  if (!match) {
    throw new Error(`route should resolve: ${segments.join("/")}`);
  }
  return match;
};

describe("Featureページコンポーネント > LegacyVrtPageShell接続 > 経路", () => {
  for (const pageCase of pageCases) {
    it(`${pageCase.feature} / 検証: ページコンポーネント表示 / 期待: 主要テキストを表示`, () => {
      const match = buildMatch(pageCase.segments);
      const { Component, expectedText } = pageCase;

      render(<Component match={match} />);

      expect(
        screen.getAllByText(expectedText, { exact: false }).length,
        `${pageCase.feature} の主要テキストが1件以上表示される`,
      ).toBeGreaterThan(0);
    });
  }
});
