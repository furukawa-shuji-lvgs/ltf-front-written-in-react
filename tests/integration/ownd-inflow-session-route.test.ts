import { describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/ownd-inflow/session/route.ts";

const extractSessionCookie = (setCookie: string): string =>
  setCookie
    .split(";")
    .find((entry) => entry.trim().startsWith("ownd_inflow_session="))
    ?.trim() ?? "";

describe("Ownd Inflow Session API > 流入セッション > 経路", () => {
  it("有効payload / 検証: 保存 / 期待: 流入情報をJSONとCookieに返す", async () => {
    // Arrange
    const request = new Request("http://localhost/api/ownd-inflow/session", {
      method: "POST",
      body: JSON.stringify({
        fullPath: "/landing/special/?sip=abc&gclid=google&q=Java&_ga=GA1.1&msLpNo=42",
        referer: "https://example.com/ref",
      }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      inflowInfo: {
        startPage: "/landing/special/?sip=abc&gclid=google&q=Java&_ga=GA1.1&msLpNo=42",
        referer: "https://example.com/ref",
        sip: "abc",
        gclid: "google",
        searchKeyword: "Java",
        gaClientId: "GA1.1",
        msLpNo: "42",
      },
      endPage: "",
    });
    expect(response.headers.get("set-cookie")).toContain("ownd_inflow_session=");
  });

  it("保存済みCookie / 検証: 取得 / 期待: 保存した流入情報を返す", async () => {
    // Arrange
    const postResponse = await POST(
      new Request("http://localhost/api/ownd-inflow/session", {
        method: "POST",
        body: JSON.stringify({
          fullPath: "/project/search/?sip=abc",
          referer: "https://example.com/ref",
        }),
      }),
    );
    const cookie = extractSessionCookie(postResponse.headers.get("set-cookie") ?? "");
    const request = new Request("http://localhost/api/ownd-inflow/session", {
      headers: { cookie },
    });

    // Act
    const response = GET(request);

    // Assert
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      inflowInfo: {
        startPage: "/project/search/?sip=abc",
        sip: "abc",
      },
    });
  });

  it("不正payload / 検証: 保存 / 期待: 400を返す", async () => {
    // Arrange
    const request = new Request("http://localhost/api/ownd-inflow/session", {
      method: "POST",
      body: JSON.stringify({ referer: "https://example.com/ref" }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
  });
});
