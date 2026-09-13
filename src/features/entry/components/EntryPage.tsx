import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { EntryLegacyBody } from "./EntryLegacyBody.tsx";

export interface EntryPageProps {
  readonly match: PageRouteMatch;
}

export const EntryPage = ({ match }: EntryPageProps) => (
  <LegacyVrtPageShell match={match}>
    <EntryLegacyBody match={match} />
  </LegacyVrtPageShell>
);
