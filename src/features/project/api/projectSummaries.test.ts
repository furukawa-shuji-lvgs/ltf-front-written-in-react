import { describe, expect, it } from "vitest";
import { getProjectSummaries } from "./projectSummaries.ts";

describe("projectSummaries > 案件一覧データ > 取得", () => {
  it("おすすめ案件 / 検証: 件数指定 / 期待: 指定件数の公開案件を返す", () => {
    // Arrange
    const count = 5;

    // Act
    const summaries = getProjectSummaries({ count });

    // Assert
    expect(summaries).toHaveLength(5);
    expect(summaries.map((summary) => summary.status)).toStrictEqual([
      "open",
      "open",
      "open",
      "open",
      "open",
    ]);
  });

  it("募集終了案件 / 検証: ステータス指定 / 期待: 募集終了案件だけを返す", () => {
    // Arrange
    const count = 3;

    // Act
    const summaries = getProjectSummaries({ count, status: "closed" });

    // Assert
    expect(summaries).toHaveLength(3);
    expect(summaries.map((summary) => summary.status)).toStrictEqual([
      "closed",
      "closed",
      "closed",
    ]);
  });
});
