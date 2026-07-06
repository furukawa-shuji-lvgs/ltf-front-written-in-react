import { LegacyArticleBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const ConsultationLegacyBody = ({ match }: { match: PageRouteMatch }) => (
  <LegacyArticleBody match={match} />
);
