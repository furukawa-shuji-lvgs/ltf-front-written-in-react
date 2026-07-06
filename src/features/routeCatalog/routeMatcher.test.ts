import { describe, expect, it } from "vitest";
import { createMetadataForRoute, listLegacyPageSources, resolvePageRoute } from "./routeMatcher.ts";
import { pageDefinitions } from "./routes.ts";

const expectedLegacySources = [
  "ltf-front/app/pages/achievement/interview/detail/[id]/index.vue",
  "ltf-front/app/pages/achievement/interview/list/index.vue",
  "ltf-front/app/pages/achievement/interview/list/p[id]/index.vue",
  "ltf-front/app/pages/consultation/detail/[id]/index.vue",
  "ltf-front/app/pages/entry/complete/index.vue",
  "ltf-front/app/pages/entry/input/[id]/short/index.vue",
  "ltf-front/app/pages/entry/input/chat/[id]/index.vue",
  "ltf-front/app/pages/entry/short/complete/index.vue",
  "ltf-front/app/pages/friend-cp/complete/index.vue",
  "ltf-front/app/pages/friend-cp/index.vue",
  "ltf-front/app/pages/friend/index.vue",
  "ltf-front/app/pages/guide/detail/[id]/index.vue",
  "ltf-front/app/pages/guide/freelance-start-guide/index.vue",
  "ltf-front/app/pages/guide/index.vue",
  "ltf-front/app/pages/guide/p[page]/index.vue",
  "ltf-front/app/pages/guide/tag/[tagId]/index.vue",
  "ltf-front/app/pages/guide/tag/[tagId]/p[page]/index.vue",
  "ltf-front/app/pages/help/index.vue",
  "ltf-front/app/pages/index.vue",
  "ltf-front/app/pages/maintenance/index.vue",
  "ltf-front/app/pages/member/complete/index.vue",
  "ltf-front/app/pages/member/input/chat/index.vue",
  "ltf-front/app/pages/member/input/short/index.vue",
  "ltf-front/app/pages/member/short/complete/index.vue",
  "ltf-front/app/pages/project/[category1]/[category2]/index.vue",
  "ltf-front/app/pages/project/[category1]/[category2]/p[page]/index.vue",
  "ltf-front/app/pages/project/[category1]/index.vue",
  "ltf-front/app/pages/project/[category1]/p[page]/index.vue",
  "ltf-front/app/pages/project/closedsearch/index.vue",
  "ltf-front/app/pages/project/closedsearch/p[page]/index.vue",
  "ltf-front/app/pages/project/detail/[id]/index.vue",
  "ltf-front/app/pages/project/marketprice/index.vue",
  "ltf-front/app/pages/project/search/index.vue",
  "ltf-front/app/pages/project/search/p[page]/index.vue",
  "ltf-front/app/pages/project/undecided/index.vue",
  "ltf-front/app/pages/service/assess/complete/index.vue",
  "ltf-front/app/pages/service/assess/index.vue",
  "ltf-front/app/pages/service/first-freelance/index.vue",
  "ltf-front/app/pages/service/index.vue",
  "ltf-front/app/pages/service/merit/accountant/1/index.vue",
  "ltf-front/app/pages/service/onsite/index.vue",
  "ltf-front/app/pages/service/phone/index.vue",
  "ltf-front/app/pages/service/pickup/index.vue",
  "ltf-front/app/pages/service/platform/index.vue",
  "ltf-front/app/pages/service/platform/member/index.vue",
  "ltf-front/app/pages/sitemap/index.vue",
  "ltf-front/app/pages/women/index.vue",
  "ltf-front/app/pages/word/index.vue",
  "ltf-front/app/pages/word/list/[id]/index.vue",
  "ltf-front/app/pages/word/list/[id]/p[page]/index.vue",
  "ltf-front/app/pages/word/p[page]/index.vue",
];

describe("routeCatalog", () => {
  it("Nuxt の全ページファイルを route catalog に含めること", () => {
    expect(listLegacyPageSources().sort()).toEqual(expectedLegacySources.sort());
  });

  it("route id が重複しないこと", () => {
    const ids = pageDefinitions.map((definition) => definition.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("トップページを解決すること", () => {
    const match = resolvePageRoute([]);
    expect(match?.definition.id).toBe("top");
    expect(match?.pathname).toBe("/");
  });

  it("接頭辞付きページネーションを解決すること", () => {
    const match = resolvePageRoute(["guide", "tag", "12", "p3"]);
    expect(match?.definition.id).toBe("guide-tag-tagId-ppage");
    expect(match?.params).toEqual({ tagId: "12", page: "3" });
    expect(match?.pathname).toBe("/guide/tag/12/p3/");
  });

  it("固定パスはカテゴリ動的ルートより優先して解決すること", () => {
    expect(resolvePageRoute(["project", "search"])?.definition.id).toBe("project-search");
    expect(resolvePageRoute(["project", "closedsearch", "p2"])?.definition.id).toBe(
      "project-closedsearch-ppage",
    );
  });

  it("カテゴリ動的ルートを解決すること", () => {
    const match = resolvePageRoute(["project", "java", "remote", "p4"]);
    expect(match?.definition.id).toBe("project-category-cross-ppage");
    expect(match?.params).toEqual({ category1: "java", category2: "remote", page: "4" });
  });

  it("数値パラメータが不正なルートは解決しないこと", () => {
    expect(resolvePageRoute(["guide", "detail", "abc"])).toBeNull();
    expect(resolvePageRoute(["word", "p0"])).toBeNull();
  });

  it("metadata に canonical を設定すること", () => {
    const match = resolvePageRoute(["project", "search"]);
    if (!match) {
      throw new Error("project/search route should resolve");
    }

    const metadata = createMetadataForRoute(match);
    expect(metadata.title).toBe("フリーランス案件検索");
    expect(metadata.alternates).toEqual({ canonical: "http://localhost:3000/project/search/" });
  });
});
