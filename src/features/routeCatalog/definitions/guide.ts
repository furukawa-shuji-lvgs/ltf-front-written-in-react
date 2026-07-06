import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const guidePageDefinitions = [
  definePage({
    id: "guide-detail-id",
    feature: "guide",
    source: "ltf-front/app/pages/guide/detail/[id]/index.vue",
    pattern: ["guide", "detail", ":id"],
    title: "フリーランスガイド記事",
    description: "フリーランスに役立つガイド記事の詳細ページです。",
    eyebrow: "ガイド",
  }),
  definePage({
    id: "guide-freelance-start-guide",
    feature: "guide",
    source: "ltf-front/app/pages/guide/freelance-start-guide/index.vue",
    pattern: ["guide", "freelance-start-guide"],
    title: "フリーランススタートガイド",
    description: "フリーランスとして働き始めるための準備や流れを紹介します。",
    eyebrow: "スタートガイド",
  }),
  definePage({
    id: "guide",
    feature: "guide",
    source: "ltf-front/app/pages/guide/index.vue",
    pattern: ["guide"],
    title: "フリーランスガイド",
    description: "フリーランスエンジニアに役立つ記事を一覧で紹介します。",
    eyebrow: "ガイド",
  }),
  definePage({
    id: "guide-ppage",
    feature: "guide",
    source: "ltf-front/app/pages/guide/p[page]/index.vue",
    pattern: ["guide", "p:page"],
    title: "フリーランスガイド",
    description: "フリーランスエンジニアに役立つ記事をページ別に紹介します。",
    eyebrow: "ガイド",
  }),
  definePage({
    id: "guide-tag-tagId",
    feature: "guide",
    source: "ltf-front/app/pages/guide/tag/[tagId]/index.vue",
    pattern: ["guide", "tag", ":tagId"],
    title: "タグ別フリーランスガイド",
    description: "指定したタグに関連するフリーランスガイド記事を紹介します。",
    eyebrow: "ガイド",
  }),
  definePage({
    id: "guide-tag-tagId-ppage",
    feature: "guide",
    source: "ltf-front/app/pages/guide/tag/[tagId]/p[page]/index.vue",
    pattern: ["guide", "tag", ":tagId", "p:page"],
    title: "タグ別フリーランスガイド",
    description: "指定したタグに関連するフリーランスガイド記事をページ別に紹介します。",
    eyebrow: "ガイド",
  }),
] as const satisfies readonly PageDefinition[];
