import { resolvePageRoute } from "@features/routeCatalog/routeMatcher.ts";
import { pageDefinitions } from "@features/routeCatalog/routes.ts";
import { describe, expect, it } from "vitest";
import { allPageRouteFixtures } from "../e2e/fixtures/allPages.ts";

const pathToSegments = (path: string): string[] =>
  new URL(path, "http://localhost").pathname.split("/").filter(Boolean);

describe("Route Catalog > VRT対象ページ > 経路", () => {
  it("Route Catalog定義 / 検証: fixture生成 / 期待: 全定義をE2E対象に含める", () => {
    // Arrange
    const definitionIds = pageDefinitions.map((definition) => definition.id).sort();

    // Act
    const fixtureDefinitionIds = allPageRouteFixtures.map((fixture) => fixture.definitionId).sort();

    // Assert
    expect(fixtureDefinitionIds, "Route Catalogの全ページ定義をE2E fixtureに反映する").toEqual(
      definitionIds,
    );
  });

  it("全ページfixture / 検証: ルート解決 / 期待: 未解決ルートがない", () => {
    // Arrange
    const fixtures = allPageRouteFixtures;

    // Act
    const unresolvedPaths = fixtures
      .filter((fixture) => !resolvePageRoute(pathToSegments(fixture.path)))
      .map((fixture) => fixture.path);

    // Assert
    expect(unresolvedPaths, "VRT fixtureにRoute Catalog未定義のパスを含めない").toEqual([]);
  });
});
