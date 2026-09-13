import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { OwndInflowSessionRecorder } from "./OwndInflowSessionRecorder.tsx";

const fetchMock = vi.fn<typeof fetch>();

const setReferrer = (value: string): void => {
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value,
  });
};

describe("owndInflowSessionRecorder > 流入セッション > 記録", () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    setReferrer("");
    globalThis.history.pushState({}, "", "/");
  });

  it("通常ページ / 検証: 初期表示 / 期待: 現在パスをセッションAPIへ送信", async () => {
    expect.hasAssertions();
    // Arrange
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(null, { status: 200 })));
    setReferrer("https://example.com/ref");
    globalThis.history.pushState({}, "", "/project/search/?skill=Java#result");

    // Act
    render(<OwndInflowSessionRecorder />);

    // Assert
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledOnce();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ownd-inflow/session",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          fullPath: "/project/search/?skill=Java#result",
          referer: "https://example.com/ref",
        }),
      }),
    );
  });

  it("完了ページ / 検証: 初期表示 / 期待: セッションAPIを呼ばない", async () => {
    expect.hasAssertions();
    // Arrange
    vi.stubGlobal("fetch", fetchMock);
    globalThis.history.pushState({}, "", "/entry/complete/");

    // Act
    render(<OwndInflowSessionRecorder />);

    // Assert
    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  it("ランディング流入 / 検証: 初期表示 / 期待: refererのlanding以降を開始ページにする", async () => {
    expect.hasAssertions();
    // Arrange
    vi.stubGlobal("fetch", fetchMock.mockResolvedValue(new Response(null, { status: 200 })));
    setReferrer("https://freelance.levtech.jp/landing/special/?sip=abc");
    globalThis.history.pushState({}, "", "/project/search/");

    // Act
    render(<OwndInflowSessionRecorder />);

    // Assert
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledOnce();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ownd-inflow/session",
      expect.objectContaining({
        body: JSON.stringify({
          fullPath: "/landing/special/?sip=abc",
          referer: "https://freelance.levtech.jp/landing/special/?sip=abc",
        }),
      }),
    );
  });
});
