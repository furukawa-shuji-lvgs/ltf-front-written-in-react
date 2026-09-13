import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { TopLegacyBody } from "./TopLegacyBody.tsx";

export interface TopPageProps {
  readonly match: PageRouteMatch;
}

export const TopPage = ({ match }: TopPageProps) => (
  <LegacyVrtPageShell match={match}>
    <TopLegacyBody match={match} />
  </LegacyVrtPageShell>
);
