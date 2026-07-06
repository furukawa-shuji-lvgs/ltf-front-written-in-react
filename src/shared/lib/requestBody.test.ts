import { describe, expect, it } from "vitest";
import {
  RequestBodyTooLargeError,
  readLimitedRequestJson,
  readLimitedRequestText,
} from "./requestBody.ts";

describe("Request Body Reader > Payload制限 > 経路", () => {
  it("上限内payload / 検証: text読取 / 期待: 本文を返す", async () => {
    // Arrange
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: "hello",
    });

    // Act
    const text = await readLimitedRequestText(request, 16);

    // Assert
    expect(text).toBe("hello");
  });

  it("上限超過payload / 検証: text読取 / 期待: サイズ超過エラーを投げる", async () => {
    // Arrange
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: "0123456789",
    });

    // Act
    const result = readLimitedRequestText(request, 4);

    // Assert
    await expect(result).rejects.toBeInstanceOf(RequestBodyTooLargeError);
  });

  it("JSON payload / 検証: JSON読取 / 期待: objectへparseする", async () => {
    // Arrange
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify({ message: "ok" }),
    });

    // Act
    const json = await readLimitedRequestJson(request, 64);

    // Assert
    expect(json).toEqual({ message: "ok" });
  });
});
