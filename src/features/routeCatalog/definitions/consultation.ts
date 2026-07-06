import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const consultationPageDefinitions = [
  definePage({
    id: "consultation-detail-id",
    feature: "consultation",
    source: "ltf-front/app/pages/consultation/detail/[id]/index.vue",
    pattern: ["consultation", "detail", ":id"],
    title: "フリーランス相談詳細",
    description: "フリーランスのキャリアや案件選びに関する相談内容を紹介します。",
    eyebrow: "相談",
  }),
] as const satisfies readonly PageDefinition[];
