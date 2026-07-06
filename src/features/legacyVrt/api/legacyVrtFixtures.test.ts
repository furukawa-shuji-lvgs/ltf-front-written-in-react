import { describe, expect, it } from "vitest";
import {
  legacyArticleItems,
  legacyProjectListItems,
  legacySitemapLinkItems,
} from "./legacyVrtFixtures.ts";

describe("legacyVrtFixtures > VRT用fixture > 生成", () => {
  it("記事fixture / 検証: 件数 / 期待: VRTで十分な件数を返す", () => {
    // Arrange
    const minimumArticleCount = 9;

    // Act
    const articleCount = legacyArticleItems.length;

    // Assert
    expect(articleCount).toBeGreaterThanOrEqual(minimumArticleCount);
  });

  it("案件fixture / 検証: ID生成 / 期待: 安定した連番IDを返す", () => {
    // Arrange
    const firstThreeIds = ["project-card-1", "project-card-2", "project-card-3"];

    // Act
    const ids = legacyProjectListItems.slice(0, 3).map((item) => item.id);

    // Assert
    expect(ids).toStrictEqual(firstThreeIds);
  });

  it("サイトマップfixture / 検証: ラベル / 期待: サービス紹介リンクを含む", () => {
    // Arrange
    const expectedLabel = "サービス紹介";

    // Act
    const labels = legacySitemapLinkItems.map((item) => item.label);

    // Assert
    expect(labels).toContain(expectedLabel);
  });
});
