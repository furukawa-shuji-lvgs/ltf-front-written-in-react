import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { InformationLegacyBody } from "./InformationLegacyBody.tsx";

export interface InformationPageProps {
  match: PageRouteMatch;
}

export const InformationPage = ({ match }: InformationPageProps) => (
  <LegacyVrtPageShell match={match}>
    <InformationLegacyBody match={match} />
  </LegacyVrtPageShell>
);
