import { getCustomEnv, getEnv } from "@shared/lib/env.ts";
import type { Metadata } from "next";
import { pageDefinitions } from "./routes.ts";
import type { PageDefinition, PageRouteMatch } from "./types.ts";

const numericParamNames = new Set(["id", "page", "tagId"]);

const normalizeSlug = (slug?: string[]): string[] =>
  (slug ?? []).filter((segment) => segment.length > 0);

const isPositiveInteger = (value: string): boolean => /^[1-9]\d*$/.test(value);

const matchPattern = (
  pattern: readonly string[],
  slug: readonly string[],
): { params: Record<string, string>; pathname: string } | null => {
  if (pattern.length !== slug.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < pattern.length; index += 1) {
    const patternSegment = pattern[index];
    const slugSegment = slug[index];
    if (patternSegment === undefined || slugSegment === undefined) {
      return null;
    }

    if (patternSegment.startsWith(":")) {
      const paramName = patternSegment.slice(1);
      if (numericParamNames.has(paramName) && !isPositiveInteger(slugSegment)) {
        return null;
      }
      params[paramName] = slugSegment;
      continue;
    }

    if (patternSegment.startsWith("p:")) {
      const match = /^p([1-9]\d*)$/.exec(slugSegment);
      if (!match) {
        return null;
      }
      const page = match[1];
      if (page === undefined) {
        return null;
      }
      params[patternSegment.slice(2)] = page;
      continue;
    }

    if (patternSegment !== slugSegment) {
      return null;
    }
  }

  return {
    params,
    pathname: slug.length === 0 ? "/" : `/${slug.join("/")}/`,
  };
};

const segmentScore = (segment: string): number => {
  if (segment.startsWith(":")) {
    return 1;
  }
  if (segment.startsWith("p:")) {
    return 2;
  }
  return 3;
};

const rankedPageDefinitions = [...pageDefinitions].sort((current, next) => {
  const currentScore = current.pattern.reduce((score, segment) => score + segmentScore(segment), 0);
  const nextScore = next.pattern.reduce((score, segment) => score + segmentScore(segment), 0);
  return nextScore - currentScore;
});

const resolvePageDefinition = (slug: readonly string[]): PageRouteMatch | null => {
  for (const definition of rankedPageDefinitions) {
    const match = matchPattern(definition.pattern, slug);
    if (match) {
      return { definition, ...match };
    }
  }

  return null;
};

export const resolvePageRoute = (slug?: string[]): PageRouteMatch | null =>
  resolvePageDefinition(normalizeSlug(slug));

const buildPageUrl = (path: string): string => {
  const env = getCustomEnv();
  const protocol = env === "staging" || env === "production" ? "https" : "http";
  return `${protocol}://${getEnv().BASE_URL}${path}`;
};

export const createMetadataForRoute = ({ definition, pathname }: PageRouteMatch): Metadata => {
  const url = buildPageUrl(pathname);

  return {
    title: definition.title,
    description: definition.description,
    keywords: definition.sections.map((section) => section.title).join(","),
    openGraph: {
      title: definition.title,
      description: definition.description,
      type: definition.ogType ?? "article",
      url,
      siteName: "レバテックフリーランス",
    },
    alternates: {
      canonical: url,
    },
  };
};

export const listLegacyPageSources = (): string[] =>
  pageDefinitions.map((definition) => definition.source);

export const listPageDefinitionsByFeature = (
  feature: PageDefinition["feature"],
): readonly PageDefinition[] =>
  pageDefinitions.filter((definition) => definition.feature === feature);
