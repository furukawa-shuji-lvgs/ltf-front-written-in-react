import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const memberPageDefinitions = [
  definePage({
    id: "member-complete",
    feature: "member",
    source: "ltf-front/app/pages/member/complete/index.vue",
    pattern: ["member", "complete"],
    title: "会員登録完了",
    description: "会員登録の受付が完了しました。今後の案内を確認できます。",
    eyebrow: "会員登録",
    layout: "form",
  }),
  definePage({
    id: "member-input-chat",
    feature: "member",
    source: "ltf-front/app/pages/member/input/chat/index.vue",
    pattern: ["member", "input", "chat"],
    title: "チャット会員登録",
    description: "チャット形式で会員登録に必要な情報を入力できます。",
    eyebrow: "会員登録",
    layout: "form",
  }),
  definePage({
    id: "member-input-short",
    feature: "member",
    source: "ltf-front/app/pages/member/input/short/index.vue",
    pattern: ["member", "input", "short"],
    title: "会員登録フォーム",
    description: "会員登録に必要なプロフィールと希望条件を入力できます。",
    eyebrow: "会員登録",
    layout: "form",
  }),
  definePage({
    id: "member-short-complete",
    feature: "member",
    source: "ltf-front/app/pages/member/short/complete/index.vue",
    pattern: ["member", "short", "complete"],
    title: "会員登録完了",
    description: "簡易会員登録の受付が完了しました。",
    eyebrow: "会員登録",
    layout: "form",
  }),
] as const satisfies readonly PageDefinition[];
