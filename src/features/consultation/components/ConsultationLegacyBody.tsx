import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyArticleBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";

export const ConsultationLegacyBody = ({ match }: { readonly match: PageRouteMatch }) => (
  <LegacyArticleBody match={match} />
);
