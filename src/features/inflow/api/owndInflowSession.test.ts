import { describe, expect, it } from "vitest";
import {
  createOwndInflowSession,
  decodeOwndInflowSessionCookie,
  encodeOwndInflowSessionCookie,
  findOwndInflowSessionCookieValue,
} from "./owndInflowSession.ts";

describe("owndInflowSession > 流入セッション > 変換", () => {
  it("ランディングURL / 検証: session生成 / 期待: クエリ値を流入情報へ写像", () => {
    // Arrange
    const input = {
      fullPath: "/landing/special/?sip=abc&gclid=google&q=Java&_ga=GA1.1&msLpNo=42",
      referer: "https://example.com/ref",
    };

    // Act
    const session = createOwndInflowSession(input, "2026-07-05T00:00:00.000Z");

    // Assert
    expect(session).toMatchObject({
      inflowInfo: {
        startPage: input.fullPath,
        referer: input.referer,
        sip: "abc",
        gclid: "google",
        searchKeyword: "Java",
        gaClientId: "GA1.1",
        msLpNo: "42",
      },
      accessHistories: [{ page: input.fullPath, accessedAt: "2026-07-05T00:00:00.000Z" }],
      endPage: "",
    });
  });

  it("保存済みsession / 検証: cookie encode decode / 期待: 同じsessionへ復元", () => {
    // Arrange
    const session = createOwndInflowSession(
      { fullPath: "/project/search/?sip=abc", referer: "" },
      "2026-07-05T00:00:00.000Z",
    );

    // Act
    const decoded = decodeOwndInflowSessionCookie(encodeOwndInflowSessionCookie(session));

    // Assert
    expect(decoded).toStrictEqual(session);
  });

  it("Cookieヘッダー / 検証: cookie抽出 / 期待: 対象cookie値だけ返す", () => {
    // Arrange
    const cookieHeader = "foo=bar; ownd_inflow_session=session-value; other=value";

    // Act
    const value = findOwndInflowSessionCookieValue(cookieHeader);

    // Assert
    expect(value).toBe("session-value");
  });
});
