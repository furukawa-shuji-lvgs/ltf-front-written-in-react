import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { TopLegacyBody } from "./TopLegacyBody.tsx";

export interface TopPageProps {
  match: PageRouteMatch;
}

export const TopPage = ({ match }: TopPageProps) => (
  <LegacyVrtPageShell match={match}>
    <TopLegacyBody match={match} />
  </LegacyVrtPageShell>
);
