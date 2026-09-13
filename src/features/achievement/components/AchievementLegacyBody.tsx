import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyGuideListBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";

export const AchievementLegacyBody = ({ match }: { readonly match: PageRouteMatch }) => (
  <LegacyGuideListBody match={match} />
);
