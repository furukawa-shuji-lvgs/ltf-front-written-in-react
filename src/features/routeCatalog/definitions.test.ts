import { describe, expect, it } from "vitest";
import { achievementPageDefinitions } from "./definitions/achievement.ts";
import { consultationPageDefinitions } from "./definitions/consultation.ts";
import { entryPageDefinitions } from "./definitions/entry.ts";
import { friendPageDefinitions } from "./definitions/friend.ts";
import { guidePageDefinitions } from "./definitions/guide.ts";
import { informationPageDefinitions } from "./definitions/information.ts";
import { maintenancePageDefinitions } from "./definitions/maintenance.ts";
import { memberPageDefinitions } from "./definitions/member.ts";
import { projectPageDefinitions } from "./definitions/project.ts";
import { servicePageDefinitions } from "./definitions/service.ts";
import { topPageDefinitions } from "./definitions/top.ts";
import { wordPageDefinitions } from "./definitions/word.ts";
import { pageDefinitions } from "./routes.ts";
import type { PageDefinition, RouteFeature } from "./types.ts";

const definitionGroups = [
  { feature: "achievement", definitions: achievementPageDefinitions },
  { feature: "consultation", definitions: consultationPageDefinitions },
  { feature: "entry", definitions: entryPageDefinitions },
  { feature: "friend", definitions: friendPageDefinitions },
  { feature: "guide", definitions: guidePageDefinitions },
  { feature: "information", definitions: informationPageDefinitions },
  { feature: "maintenance", definitions: maintenancePageDefinitions },
  { feature: "member", definitions: memberPageDefinitions },
  { feature: "project", definitions: projectPageDefinitions },
  { feature: "service", definitions: servicePageDefinitions },
  { feature: "top", definitions: topPageDefinitions },
  { feature: "word", definitions: wordPageDefinitions },
] as const satisfies readonly {
  feature: RouteFeature;
  definitions: readonly PageDefinition[];
}[];

describe("Route Catalog Definitions > Feature分割 > 経路", () => {
  for (const { feature, definitions } of definitionGroups) {
    it(`${feature} / 検証: feature所有 / 期待: 自featureの定義だけを持つ`, () => {
      // Arrange
      const features = definitions.map((definition) => definition.feature);

      // Act
      const unexpectedFeatures = features.filter(
        (definitionFeature) => definitionFeature !== feature,
      );

      // Assert
      expect(unexpectedFeatures).toEqual([]);
    });
  }

  it("集約定義 / 検証: feature分割 / 期待: routes.tsの定義と一致する", () => {
    // Arrange
    const groupedIds = definitionGroups
      .flatMap(({ definitions }) => definitions.map((definition) => definition.id))
      .sort();

    // Act
    const aggregateIds = pageDefinitions.map((definition) => definition.id).sort();

    // Assert
    expect(groupedIds).toEqual(aggregateIds);
  });
});
