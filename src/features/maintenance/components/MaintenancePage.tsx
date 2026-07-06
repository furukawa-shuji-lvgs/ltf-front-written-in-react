import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { MaintenanceLegacyBody } from "./MaintenanceLegacyBody.tsx";

export interface MaintenancePageProps {
  match: PageRouteMatch;
}

export const MaintenancePage = ({ match }: MaintenancePageProps) => (
  <LegacyVrtPageShell match={match}>
    <MaintenanceLegacyBody match={match} />
  </LegacyVrtPageShell>
);
