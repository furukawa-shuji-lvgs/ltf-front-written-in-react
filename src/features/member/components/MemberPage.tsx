import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { MemberLegacyBody } from "./MemberLegacyBody.tsx";

export interface MemberPageProps {
  match: PageRouteMatch;
}

export const MemberPage = ({ match }: MemberPageProps) => (
  <LegacyVrtPageShell match={match}>
    <MemberLegacyBody match={match} />
  </LegacyVrtPageShell>
);
