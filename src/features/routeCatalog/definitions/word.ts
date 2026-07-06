import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const wordPageDefinitions = [
  definePage({
    id: "word",
    feature: "word",
    source: "ltf-front/app/pages/word/index.vue",
    pattern: ["word"],
    title: "IT用語集",
    description: "IT・Web業界の用語を一覧で調べられます。",
    eyebrow: "用語集",
  }),
  definePage({
    id: "word-list-id",
    feature: "word",
    source: "ltf-front/app/pages/word/list/[id]/index.vue",
    pattern: ["word", "list", ":id"],
    title: "用語別案件一覧",
    description: "指定した用語に関連する案件を一覧で確認できます。",
    eyebrow: "用語集",
  }),
  definePage({
    id: "word-list-id-ppage",
    feature: "word",
    source: "ltf-front/app/pages/word/list/[id]/p[page]/index.vue",
    pattern: ["word", "list", ":id", "p:page"],
    title: "用語別案件一覧",
    description: "指定した用語に関連する案件をページ別に確認できます。",
    eyebrow: "用語集",
  }),
  definePage({
    id: "word-ppage",
    feature: "word",
    source: "ltf-front/app/pages/word/p[page]/index.vue",
    pattern: ["word", "p:page"],
    title: "IT用語集",
    description: "IT・Web業界の用語をページ別に調べられます。",
    eyebrow: "用語集",
  }),
] as const satisfies readonly PageDefinition[];
