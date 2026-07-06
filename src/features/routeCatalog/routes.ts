import { achievementPageDefinitions } from "./definitions/achievement.ts";
import { consultationPageDefinitions } from "./definitions/consultation.ts";
import { entryPageDefinitions } from "./definitions/entry.ts";
import { friendPageDefinitions } from "./definitions/friend.ts";
import { guidePageDefinitions } from "./definitions/guide.ts";
import { informationPageDefinitions } from "./definitions/information.ts";
import { maintenancePageDefinitions } from "./definitions/maintenance.ts";
import { memberPageDefinitions } from "./definitions/member.ts";
import { projectPageDefinitions } from "./definitions/project.ts";
import { servicePageDefinitions } from "./definitions/service.ts";
import { topPageDefinitions } from "./definitions/top.ts";
import { wordPageDefinitions } from "./definitions/word.ts";

export const pageDefinitions = [
  ...topPageDefinitions,
  ...achievementPageDefinitions,
  ...consultationPageDefinitions,
  ...entryPageDefinitions,
  ...friendPageDefinitions,
  ...guidePageDefinitions,
  ...informationPageDefinitions,
  ...maintenancePageDefinitions,
  ...memberPageDefinitions,
  ...projectPageDefinitions,
  ...servicePageDefinitions,
  ...wordPageDefinitions,
] as const;

export const legacyPageSources = pageDefinitions.map((definition) => definition.source);
