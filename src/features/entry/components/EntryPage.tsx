import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { EntryLegacyBody } from "./EntryLegacyBody.tsx";

export interface EntryPageProps {
  match: PageRouteMatch;
}

export const EntryPage = ({ match }: EntryPageProps) => (
  <LegacyVrtPageShell match={match}>
    <EntryLegacyBody match={match} />
  </LegacyVrtPageShell>
);
