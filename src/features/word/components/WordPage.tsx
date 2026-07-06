import { LegacyVrtPageShell } from "@features/legacyVrt/components/LegacyVrtPageShell.tsx";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import { WordLegacyBody } from "./WordLegacyBody.tsx";

export interface WordPageProps {
  match: PageRouteMatch;
}

export const WordPage = ({ match }: WordPageProps) => (
  <LegacyVrtPageShell match={match}>
    <WordLegacyBody match={match} />
  </LegacyVrtPageShell>
);
