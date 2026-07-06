import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { FriendLegacyBody } from "./FriendLegacyBody.tsx";

export interface FriendPageProps {
  match: PageRouteMatch;
}

export const FriendPage = ({ match }: FriendPageProps) => (
  <LegacyVrtPageShell match={match}>
    <FriendLegacyBody match={match} />
  </LegacyVrtPageShell>
);
