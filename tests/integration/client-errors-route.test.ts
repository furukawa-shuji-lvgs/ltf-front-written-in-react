import { afterEach, describe, expect, it, vi } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { POST } from "@/app/api/client-errors/route.ts";
import { clearRateLimitBuckets } from "@/shared/lib/rateLimit.ts";

const { errorMock } = vi.hoisted(() => ({
  errorMock: vi.fn<Logger["error"]>(),
}));

vi.mock(import("@shared/lib/logger"), () => ({
  getLogger: vi.fn<() => Logger>(() => ({
    error: errorMock,
    info: vi.fn<Logger["info"]>(),
    warn: vi.fn<Logger["warn"]>(),
  })),
}));

describe("client Errors API > クライアントエラー > 経路", () => {
  afterEach(() => {
    vi.useRealTimers();
    clearRateLimitBuckets();
  });

  it("有効payload / 検証: 受付 / 期待: 204で記録する", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/client-errors", {
      method: "POST",
      headers: {
        "user-agent": "vitest-agent",
        "x-forwarded-for": "203.0.113.1, 198.51.100.2",
        "x-request-id": "request-id-1",
      },
      body: JSON.stringify({
        message: "failed",
        digest: "digest-1",
        path: "/guide/",
        userAgent: "browser-agent",
      }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(204);
    expect(errorMock).toHaveBeenCalledWith(
      {
        error: {
          source: "client",
          message: "failed",
          digest: "digest-1",
          path: "/guide/",
          userAgent: "browser-agent",
          context: {
            requestUrl: "http://localhost/api/client-errors",
            requestUserAgent: "vitest-agent",
            forwardedFor: "203.0.113.1",
            requestId: "request-id-1",
          },
        },
      },
      "Application error tracked.",
    );
  });

  it("不正JSON / 検証: 受付 / 期待: 400を返す", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/client-errors", {
      method: "POST",
      body: "{",
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toStrictEqual({
      message: "Invalid client error payload.",
    });
  });

  it("巨大payload / 検証: 受付 / 期待: 413を返す", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/client-errors", {
      method: "POST",
      body: JSON.stringify({ message: "x".repeat(9000) }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toStrictEqual({
      message: "Client error payload is too large.",
    });
  });

  it("連続送信 / 検証: rate limit / 期待: 429とretry-afterを返す", async () => {
    expect.hasAssertions();
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T00:00:00.000Z"));

    for (let index = 0; index < 30; index++) {
      // oxlint-disable-next-line eslint/no-await-in-loop -- 同じクライアントのリクエストを順に送りレート制限を確認する。
      await POST(buildRequest());
    }

    // Act
    const response = await POST(buildRequest());

    // Assert
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    await expect(response.json()).resolves.toStrictEqual({
      message: "Too many client error reports.",
    });
  });
});

const buildRequest = () =>
  new Request("http://localhost/api/client-errors", {
    method: "POST",
    headers: {
      "x-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify({ message: "failed" }),
  });
