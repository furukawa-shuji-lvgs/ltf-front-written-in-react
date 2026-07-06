import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { ProjectLegacyBody } from "./ProjectLegacyBody.tsx";

export interface ProjectPageProps {
  match: PageRouteMatch;
}

export const ProjectPage = ({ match }: ProjectPageProps) => (
  <LegacyVrtPageShell match={match}>
    <ProjectLegacyBody match={match} />
  </LegacyVrtPageShell>
);
