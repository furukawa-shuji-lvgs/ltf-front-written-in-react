import { pageDefinitions } from "../../../src/features/routeCatalog/routes.ts";
import type { PageDefinition } from "../../../src/features/routeCatalog/types.ts";

export type AllPageRouteFixture = {
  definitionId: string;
  path: string;
  slug: string;
  text: string;
  spText?: string;
  visualPath?: string;
};

export type AllPageUxRoute = {
  path: string;
  slug: string;
  text: string;
  spText?: string;
};

export type AllPageVisualRoute = {
  path: string;
  slug: string;
};

type RouteFixtureOptions = {
  slug?: string;
  text?: string;
  spText?: string;
  query?: string;
  visualQuery?: string;
  params?: Record<string, string>;
};

export const APP_ROOT_SELECTOR = "[data-testid='app-root']";

const defaultParamValues: Record<string, string> = {
  id: "1",
  page: "2",
  tagId: "1",
  category1: "skill-3",
  category2: "occ-4",
};

const routeFixtureOptionsById: Record<string, RouteFixtureOptions> = {
  "entry-input-id-short": {
    text: "同意して回答する",
    query: "hash=ux",
    visualQuery: "hash=vrt",
    params: { id: "1001" },
  },
  "entry-input-chat-id": {
    text: "同意して回答する",
    params: { id: "1001" },
  },
  "friend-cp-complete": { text: "スキル・経験・希望の入力について" },
  friend: { text: "知人紹介サービス" },
  "guide-detail-id": {
    spText: "案件を選ぶときのチェックポイント",
    params: { id: "1508" },
  },
  "guide-tag-tagId": { slug: "guide-tag" },
  "guide-tag-tagId-ppage": { slug: "guide-tag-page" },
  maintenance: { text: "メンテナンス中です" },
  "member-input-chat": { text: "同意して回答する" },
  "member-input-short": {
    text: "同意して回答する",
    query: "hash=ux",
    visualQuery: "hash=vrt",
  },
  "project-category-cross": { slug: "project-cross-category", text: "おすすめ案件一覧" },
  "project-category-cross-ppage": {
    slug: "project-cross-category-page",
    text: "新着案件一覧",
  },
  "project-category": { text: "おすすめ案件一覧" },
  "project-category-ppage": { text: "新着案件一覧" },
  "project-closedsearch": { text: "募集終了の求人・案件一覧" },
  "project-closedsearch-ppage": { text: "募集終了の求人・案件一覧" },
  "project-detail-id": {
    slug: "project-detail",
    text: "Java/Spring Bootを用いた",
    params: { id: "1001" },
  },
  "project-marketprice": { text: "案件検索単価相場" },
  "project-search": { text: "まずは、ご経験のある職種" },
  "project-search-ppage": { text: "新着案件一覧" },
  "project-undecided": { text: "複数の案件にご応募" },
  "service-assess-complete": {
    text: "診断結果",
    query:
      "categoryId=1&skillId=3&experienceYearId=5&currentMonthlyIncomeId=3&freelanceAspirationId=1",
  },
  "service-assess": { text: "フリーランスエンジニア 単価診断" },
  "service-onsite": { spText: "企業で経験を積みたい方へ" },
  "service-phone": { spText: "電話番号" },
  "service-merit-accountant-1": { slug: "service-merit-accountant" },
  word: { text: "おすすめキーワード" },
  "word-list-id": { slug: "word-list", text: "おすすめキーワード", spText: "の求人・案件一覧" },
  "word-list-id-ppage": {
    slug: "word-list-page",
    text: "おすすめキーワード",
    spText: "の求人・案件一覧",
  },
  "word-ppage": { text: "おすすめキーワード" },
};

const appendQuery = (pathname: string, query?: string): string =>
  query ? `${pathname}?${query}` : pathname;

const defaultSlugFor = (definitionId: string): string =>
  definitionId
    .replace(/-id/g, "")
    .replace(/-pid$/g, "-page")
    .replace(/-ppage$/g, "-page")
    .replace(/-1$/g, "");

const getParamValue = (definition: PageDefinition, paramName: string): string => {
  const options = routeFixtureOptionsById[definition.id];
  return options?.params?.[paramName] ?? defaultParamValues[paramName] ?? "1";
};

const buildPathname = (definition: PageDefinition): string => {
  if (definition.pattern.length === 0) return "/";

  const segments = definition.pattern.map((segment) => {
    if (segment.startsWith(":")) {
      return getParamValue(definition, segment.slice(1));
    }
    if (segment.startsWith("p:")) {
      return `p${getParamValue(definition, segment.slice(2))}`;
    }
    return segment;
  });

  return `/${segments.join("/")}/`;
};

const buildRouteFixture = (definition: PageDefinition): AllPageRouteFixture => {
  const options = routeFixtureOptionsById[definition.id];
  const pathname = buildPathname(definition);
  const path = appendQuery(pathname, options?.query);
  const visualPath = options?.visualQuery ? appendQuery(pathname, options.visualQuery) : undefined;

  return {
    definitionId: definition.id,
    path,
    slug: options?.slug ?? defaultSlugFor(definition.id),
    text: options?.text ?? definition.title,
    ...(options?.spText === undefined ? {} : { spText: options.spText }),
    ...(visualPath === undefined ? {} : { visualPath }),
  };
};

export const allPageRouteFixtures: readonly AllPageRouteFixture[] =
  pageDefinitions.map(buildRouteFixture);

export const allPageUxRoutes = allPageRouteFixtures.map(
  ({ path, slug, text, spText }): AllPageUxRoute => ({
    path,
    slug,
    text,
    ...(spText === undefined ? {} : { spText }),
  }),
);

export const allPageVisualRoutes = allPageRouteFixtures.map(
  ({ path, slug, visualPath }): AllPageVisualRoute => ({
    path: visualPath ?? path,
    slug,
  }),
);
