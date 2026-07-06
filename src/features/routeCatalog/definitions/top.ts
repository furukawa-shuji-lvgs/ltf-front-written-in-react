import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const topPageDefinitions = [
  definePage({
    id: "top",
    feature: "top",
    source: "ltf-front/app/pages/index.vue",
    pattern: [],
    title: "ITフリーランスエンジニアの求人・案件",
    description:
      "レバテックフリーランスのトップページです。案件検索、サービス紹介、役立つ情報へ移動できます。",
    eyebrow: "レバテックフリーランス",
    layout: "wide",
  }),
] as const satisfies readonly PageDefinition[];
