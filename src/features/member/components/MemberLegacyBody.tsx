import { LegacyFormBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const MemberLegacyBody = ({ match }: { match: PageRouteMatch }) => (
  <LegacyFormBody match={match} />
);
