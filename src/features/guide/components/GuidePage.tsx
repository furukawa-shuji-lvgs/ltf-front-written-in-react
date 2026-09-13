import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { GuideLegacyBody } from "./GuideLegacyBody.tsx";

export interface GuidePageProps {
  readonly match: PageRouteMatch;
}

export const GuidePage = ({ match }: GuidePageProps) => (
  <LegacyVrtPageShell match={match}>
    <GuideLegacyBody match={match} />
  </LegacyVrtPageShell>
);
