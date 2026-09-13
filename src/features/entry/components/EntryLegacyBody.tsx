import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyFormBody } from "@features/legacyVrt/components/LegacyVrtParts.tsx";

export const EntryLegacyBody = ({ match }: { readonly match: PageRouteMatch }) => (
  <LegacyFormBody match={match} />
);
