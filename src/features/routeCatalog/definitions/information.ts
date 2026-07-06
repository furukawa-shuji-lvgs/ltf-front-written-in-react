import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const informationPageDefinitions = [
  definePage({
    id: "help",
    feature: "information",
    source: "ltf-front/app/pages/help/index.vue",
    pattern: ["help"],
    title: "ヘルプ",
    description: "レバテックフリーランスの利用に関するよくある質問を確認できます。",
    eyebrow: "サポート",
  }),
  definePage({
    id: "sitemap",
    feature: "information",
    source: "ltf-front/app/pages/sitemap/index.vue",
    pattern: ["sitemap"],
    title: "サイトマップ",
    description: "レバテックフリーランス内の主要ページを一覧で確認できます。",
    eyebrow: "サイト情報",
  }),
  definePage({
    id: "women",
    feature: "information",
    source: "ltf-front/app/pages/women/index.vue",
    pattern: ["women"],
    title: "女性フリーランス向け支援",
    description: "女性フリーランス向けの働き方やサポート情報を紹介します。",
    eyebrow: "特集",
  }),
] as const satisfies readonly PageDefinition[];
