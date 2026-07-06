import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { AchievementLegacyBody } from "./AchievementLegacyBody.tsx";

export interface AchievementPageProps {
  match: PageRouteMatch;
}

export const AchievementPage = ({ match }: AchievementPageProps) => (
  <LegacyVrtPageShell match={match}>
    <AchievementLegacyBody match={match} />
  </LegacyVrtPageShell>
);
