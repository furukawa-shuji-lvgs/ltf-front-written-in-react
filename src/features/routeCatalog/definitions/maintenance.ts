import type { PageDefinition } from "../types.ts";
import { definePage } from "./common.ts";

export const maintenancePageDefinitions = [
  definePage({
    id: "maintenance",
    feature: "maintenance",
    source: "ltf-front/app/pages/maintenance/index.vue",
    pattern: ["maintenance"],
    title: "メンテナンス",
    description: "サービスメンテナンスのお知らせです。",
    eyebrow: "お知らせ",
    layout: "maintenance",
  }),
] as const satisfies readonly PageDefinition[];
