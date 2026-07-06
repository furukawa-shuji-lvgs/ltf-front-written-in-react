import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { ServiceLegacyBody } from "./ServiceLegacyBody.tsx";

export interface ServicePageProps {
  match: PageRouteMatch;
}

export const ServicePage = ({ match }: ServicePageProps) => (
  <LegacyVrtPageShell match={match}>
    <ServiceLegacyBody match={match} />
  </LegacyVrtPageShell>
);
