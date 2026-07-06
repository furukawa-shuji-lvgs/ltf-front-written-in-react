import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route.ts";

describe("Health API > 稼働確認 > 経路", () => {
  it("通常起動 / 検証: healthレスポンス / 期待: okを返す", async () => {
    // Arrange
    const expectedBody = { status: "ok" };

    // Act
    const response = GET();

    // Assert
    expect(response.status, "health endpointはHTTP 200を返す").toBe(200);
    await expect(response.json(), "health endpointは固定のok bodyを返す").resolves.toEqual(
      expectedBody,
    );
  });
});
