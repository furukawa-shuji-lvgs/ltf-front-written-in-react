import { afterEach, describe, expect, it, vi } from "vitest";

import { buildLoginInflowPayload, postLoginInflowInfo } from "./loginInflow.ts";

const fetchMock = vi.fn<typeof fetch>();

const setReferrer = (value: string): void => {
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value,
  });
};

describe("loginInflow > ログイン流入 > 送信", () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    setReferrer("");
    globalThis.history.pushState({}, "", "/");
  });

  it("検索ページ / 検証: payload生成 / 期待: 現在ページと遷移先を含める", () => {
    expect.hasAssertions();
    // Arrange
    setReferrer("https://example.com/ref");
    globalThis.history.pushState({}, "", "/project/search/?keyword=Java");

    // Act
    const payload = buildLoginInflowPayload("https://platform.levtech.jp/login?inflowMedia=ltf");

    // Assert
    expect(payload).toStrictEqual({
      startPage: "/project/search/?keyword=Java",
      endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
      referer: "https://example.com/ref",
      inflowMedia: "ltf",
    });
  });

  it("ログイン押下 / 検証: 送信 / 期待: 流入APIへpayloadをPOSTする", async () => {
    expect.hasAssertions();
    // Arrange
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(null, { status: 200 })));
    setReferrer("https://example.com/ref");
    globalThis.history.pushState({}, "", "/guide/");

    // Act
    await postLoginInflowInfo("https://platform.levtech.jp/login?inflowMedia=ltf");

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/grpc/login/postLoginInflowInfo",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          startPage: "/guide/",
          endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
          referer: "https://example.com/ref",
          inflowMedia: "ltf",
        }),
      }),
    );
  });
});
