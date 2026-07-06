import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/client-errors/route.ts";
import { clearRateLimitBuckets } from "@/shared/lib/rateLimit.ts";

const { errorMock } = vi.hoisted(() => ({
  errorMock: vi.fn(),
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    error: errorMock,
  })),
}));

afterEach(() => {
  vi.useRealTimers();
  clearRateLimitBuckets();
});

describe("Client Errors API > クライアントエラー > 経路", () => {
  it("有効payload / 検証: 受付 / 期待: 204で記録する", async () => {
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
    // Arrange
    const request = new Request("http://localhost/api/client-errors", {
      method: "POST",
      body: "{",
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid client error payload.",
    });
  });

  it("巨大payload / 検証: 受付 / 期待: 413を返す", async () => {
    // Arrange
    const request = new Request("http://localhost/api/client-errors", {
      method: "POST",
      body: JSON.stringify({ message: "x".repeat(9_000) }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      message: "Client error payload is too large.",
    });
  });

  it("連続送信 / 検証: rate limit / 期待: 429とretry-afterを返す", async () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T00:00:00.000Z"));
    const buildRequest = () =>
      new Request("http://localhost/api/client-errors", {
        method: "POST",
        headers: {
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({ message: "failed" }),
      });

    for (let i = 0; i < 30; i++) {
      await POST(buildRequest());
    }

    // Act
    const response = await POST(buildRequest());

    // Assert
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    await expect(response.json()).resolves.toEqual({
      message: "Too many client error reports.",
    });
  });
});
