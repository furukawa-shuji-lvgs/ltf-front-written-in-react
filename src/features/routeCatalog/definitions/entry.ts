import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const entryPageDefinitions = [
  definePage({
    id: "entry-complete",
    feature: "entry",
    source: "ltf-front/app/pages/entry/complete/index.vue",
    pattern: ["entry", "complete"],
    title: "応募完了",
    description: "案件応募の受付が完了しました。今後の連絡と案内を確認できます。",
    eyebrow: "応募",
    layout: "form",
  }),
  definePage({
    id: "entry-input-id-short",
    feature: "entry",
    source: "ltf-front/app/pages/entry/input/[id]/short/index.vue",
    pattern: ["entry", "input", ":id", "short"],
    title: "案件応募フォーム",
    description: "案件への応募に必要な情報を入力できます。",
    eyebrow: "応募",
    layout: "form",
  }),
  definePage({
    id: "entry-input-chat-id",
    feature: "entry",
    source: "ltf-front/app/pages/entry/input/chat/[id]/index.vue",
    pattern: ["entry", "input", "chat", ":id"],
    title: "チャット応募フォーム",
    description: "チャット形式で案件応募に必要な情報を入力できます。",
    eyebrow: "応募",
    layout: "form",
  }),
  definePage({
    id: "entry-short-complete",
    feature: "entry",
    source: "ltf-front/app/pages/entry/short/complete/index.vue",
    pattern: ["entry", "short", "complete"],
    title: "応募完了",
    description: "簡易応募の受付が完了しました。今後の案内を確認できます。",
    eyebrow: "応募",
    layout: "form",
  }),
] as const satisfies readonly PageDefinition[];
