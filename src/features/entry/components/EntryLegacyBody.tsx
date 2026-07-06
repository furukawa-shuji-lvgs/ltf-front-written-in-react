import { LegacyFormBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const EntryLegacyBody = ({ match }: { match: PageRouteMatch }) => (
  <LegacyFormBody match={match} />
);
