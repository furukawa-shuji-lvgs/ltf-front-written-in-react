import { LegacyGuideListBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const AchievementLegacyBody = ({ match }: { match: PageRouteMatch }) => (
  <LegacyGuideListBody match={match} />
);
