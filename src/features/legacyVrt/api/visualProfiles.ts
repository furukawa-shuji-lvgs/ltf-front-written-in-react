import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import type { CSSProperties } from "react";

export type VisualProfile = {
  pc: number;
  sp: number;
};

export type VisualStyle = CSSProperties & {
  "--legacy-pc-height": string;
  "--legacy-sp-height": string;
};

const visualProfiles: Record<string, VisualProfile> = {
  "achievement-interview-detail-id": { pc: 3066, sp: 3765 },
  "achievement-interview-list": { pc: 3635, sp: 4006 },
  "achievement-interview-list-pid": { pc: 3635, sp: 4006 },
  "consultation-detail-id": { pc: 4804, sp: 6558 },
  "entry-complete": { pc: 1285, sp: 1194 },
  "entry-input-id-short": { pc: 720, sp: 520 },
  "entry-input-chat-id": { pc: 720, sp: 812 },
  "entry-short-complete": { pc: 1266, sp: 1167 },
  "friend-cp": { pc: 5432, sp: 7104 },
  "friend-cp-complete": { pc: 1285, sp: 1265 },
  friend: { pc: 4416, sp: 6147 },
  guide: { pc: 2391, sp: 3492 },
  "guide-detail-id": { pc: 3296, sp: 4813 },
  "guide-freelance-start-guide": { pc: 4044, sp: 5918 },
  "guide-ppage": { pc: 2391, sp: 3492 },
  "guide-tag-tagId": { pc: 2391, sp: 3492 },
  "guide-tag-tagId-ppage": { pc: 2391, sp: 3492 },
  help: { pc: 3507, sp: 5410 },
  maintenance: { pc: 442, sp: 434 },
  "member-complete": { pc: 1285, sp: 1194 },
  "member-input-chat": { pc: 720, sp: 1012 },
  "member-input-short": { pc: 720, sp: 520 },
  "member-short-complete": { pc: 1266, sp: 1167 },
  "project-category": { pc: 4776, sp: 6259 },
  "project-category-cross": { pc: 4648, sp: 6161 },
  "project-category-cross-ppage": { pc: 4648, sp: 6161 },
  "project-category-ppage": { pc: 4776, sp: 6259 },
  "project-closedsearch": { pc: 2308, sp: 3899 },
  "project-closedsearch-ppage": { pc: 2308, sp: 3899 },
  "project-detail-id": { pc: 5709, sp: 7107 },
  "project-marketprice": { pc: 3420, sp: 5067 },
  "project-search": { pc: 2218, sp: 5767 },
  "project-search-ppage": { pc: 4653, sp: 5807 },
  "project-undecided": { pc: 1309, sp: 1423 },
  service: { pc: 5415, sp: 7613 },
  "service-assess": { pc: 720, sp: 812 },
  "service-assess-complete": { pc: 2112, sp: 2288 },
  "service-first-freelance": { pc: 9783, sp: 10_557 },
  "service-merit-accountant-1": { pc: 4396, sp: 5914 },
  "service-onsite": { pc: 7560, sp: 9164 },
  "service-phone": { pc: 3133, sp: 4528 },
  "service-pickup": { pc: 15_542, sp: 16_684 },
  "service-platform": { pc: 7587, sp: 11_047 },
  "service-platform-member": { pc: 5323, sp: 7669 },
  sitemap: { pc: 2205, sp: 3824 },
  top: { pc: 7628, sp: 8899 },
  women: { pc: 6174, sp: 8285 },
  word: { pc: 1710, sp: 3026 },
  "word-list-id": { pc: 3275, sp: 4478 },
  "word-list-id-ppage": { pc: 3275, sp: 4478 },
  "word-ppage": { pc: 1710, sp: 3026 },
};

export const profileFor = (match: PageRouteMatch): VisualProfile =>
  visualProfiles[match.definition.id] ?? { pc: 2600, sp: 4200 };

export const visualStyleFor = (match: PageRouteMatch): VisualStyle => {
  const profile = profileFor(match);
  return {
    "--legacy-pc-height": `${profile.pc}px`,
    "--legacy-sp-height": `${profile.sp}px`,
  };
};
