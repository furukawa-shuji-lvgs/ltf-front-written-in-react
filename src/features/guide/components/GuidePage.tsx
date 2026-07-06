import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { GuideLegacyBody } from "./GuideLegacyBody.tsx";

export interface GuidePageProps {
  match: PageRouteMatch;
}

export const GuidePage = ({ match }: GuidePageProps) => (
  <LegacyVrtPageShell match={match}>
    <GuideLegacyBody match={match} />
  </LegacyVrtPageShell>
);
