import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const friendPageDefinitions = [
  definePage({
    id: "friend-cp-complete",
    feature: "friend",
    source: "ltf-front/app/pages/friend-cp/complete/index.vue",
    pattern: ["friend-cp", "complete"],
    title: "友人紹介キャンペーン登録完了",
    description: "友人紹介キャンペーンの登録受付が完了しました。",
    eyebrow: "キャンペーン",
    layout: "form",
  }),
  definePage({
    id: "friend-cp",
    feature: "friend",
    source: "ltf-front/app/pages/friend-cp/index.vue",
    pattern: ["friend-cp"],
    title: "友人紹介キャンペーン",
    description: "レバテックフリーランスの友人紹介キャンペーンを紹介します。",
    eyebrow: "キャンペーン",
  }),
  definePage({
    id: "friend",
    feature: "friend",
    source: "ltf-front/app/pages/friend/index.vue",
    pattern: ["friend"],
    title: "知人紹介",
    description: "フリーランスを検討している知人への紹介サービスを紹介します。",
    eyebrow: "紹介",
  }),
] as const satisfies readonly PageDefinition[];
