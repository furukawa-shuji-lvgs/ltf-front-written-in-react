import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";

import { InformationLegacyBody } from "./InformationLegacyBody.tsx";

export interface InformationPageProps {
  readonly match: PageRouteMatch;
}

export const InformationPage = ({ match }: InformationPageProps) => (
  <LegacyVrtPageShell match={match}>
    <InformationLegacyBody match={match} />
  </LegacyVrtPageShell>
);
