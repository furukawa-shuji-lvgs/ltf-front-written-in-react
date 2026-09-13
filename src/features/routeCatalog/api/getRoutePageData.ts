import "server-only";
import { cache } from "react";

import type { PageRouteMatch } from "../types.ts";

import { createMetadataForRoute, resolvePageRoute } from "../routeMatcher.ts";

export type RoutePageData =
  | {
      readonly match: PageRouteMatch;
      readonly metadata: ReturnType<typeof createMetadataForRoute>;
    }
  | {
      readonly match: null;
      readonly metadata: null;
    };

export const toRouteSlugKey = (slug?: readonly string[]): string =>
  (slug ?? []).filter((segment) => segment.length > 0).join("/");

const splitRouteSlugKey = (slugKey: string): readonly string[] =>
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
