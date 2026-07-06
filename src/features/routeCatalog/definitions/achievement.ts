import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const achievementPageDefinitions = [
  definePage({
    id: "achievement-interview-detail-id",
    feature: "achievement",
    source: "ltf-front/app/pages/achievement/interview/detail/[id]/index.vue",
    pattern: ["achievement", "interview", "detail", ":id"],
    title: "利用者インタビュー詳細",
    description: "フリーランスとして参画した方のインタビュー詳細を紹介します。",
    eyebrow: "インタビュー",
  }),
  definePage({
    id: "achievement-interview-list",
    feature: "achievement",
    source: "ltf-front/app/pages/achievement/interview/list/index.vue",
    pattern: ["achievement", "interview", "list"],
    title: "利用者インタビュー一覧",
    description: "レバテックフリーランス利用者のインタビューを一覧で紹介します。",
    eyebrow: "インタビュー",
  }),
  definePage({
    id: "achievement-interview-list-pid",
    feature: "achievement",
    source: "ltf-front/app/pages/achievement/interview/list/p[id]/index.vue",
    pattern: ["achievement", "interview", "list", "p:page"],
    title: "利用者インタビュー一覧",
    description: "レバテックフリーランス利用者のインタビューをページ別に紹介します。",
    eyebrow: "インタビュー",
  }),
] as const satisfies readonly PageDefinition[];
