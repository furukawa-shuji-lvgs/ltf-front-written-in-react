import "server-only";

import { cache } from "react";
import { createMetadataForRoute, resolvePageRoute } from "../routeMatcher.ts";
import type { PageRouteMatch } from "../types.ts";

export type RoutePageData =
  | {
      match: PageRouteMatch;
      metadata: ReturnType<typeof createMetadataForRoute>;
    }
  | {
      match: null;
      metadata: null;
    };

export const toRouteSlugKey = (slug?: readonly string[]): string =>
  (slug ?? []).filter((segment) => segment.length > 0).join("/");

const splitRouteSlugKey = (slugKey: string): string[] =>
  slugKey.length === 0 ? [] : slugKey.split("/").filter((segment) => segment.length > 0);

export const getRoutePageDataBySlugKey = cache((slugKey: string): RoutePageData => {
  const match = resolvePageRoute(splitRouteSlugKey(slugKey));

  if (!match) {
    return {
      match: null,
      metadata: null,
    };
  }

  return {
    match,
    metadata: createMetadataForRoute(match),
  };
});
