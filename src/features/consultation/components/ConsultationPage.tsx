import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { ConsultationLegacyBody } from "./ConsultationLegacyBody.tsx";

export interface ConsultationPageProps {
  match: PageRouteMatch;
}

export const ConsultationPage = ({ match }: ConsultationPageProps) => (
  <LegacyVrtPageShell match={match}>
    <ConsultationLegacyBody match={match} />
  </LegacyVrtPageShell>
);
