import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { ConsultationLegacyBody } from "./ConsultationLegacyBody.tsx";

export interface ConsultationPageProps {
  readonly match: PageRouteMatch;
}

export const ConsultationPage = ({ match }: ConsultationPageProps) => (
  <LegacyVrtPageShell match={match}>
    <ConsultationLegacyBody match={match} />
  </LegacyVrtPageShell>
);
