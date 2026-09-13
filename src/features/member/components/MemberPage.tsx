import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { MemberLegacyBody } from "./MemberLegacyBody.tsx";

export interface MemberPageProps {
  readonly match: PageRouteMatch;
}

export const MemberPage = ({ match }: MemberPageProps) => (
  <LegacyVrtPageShell match={match}>
    <MemberLegacyBody match={match} />
  </LegacyVrtPageShell>
);
