import { afterEach, describe, expect, it, vi } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { POST } from "@/app/api/csp-report/route.ts";
import { clearRateLimitBuckets } from "@/shared/lib/rateLimit.ts";

const { warnMock } = vi.hoisted(() => ({
  warnMock: vi.fn<Logger["warn"]>(),
}));

vi.mock(import("@shared/lib/logger"), () => ({
  getLogger: vi.fn<() => Logger>(() => ({
    warn: warnMock,
    info: vi.fn<Logger["info"]>(),
    error: vi.fn<Logger["error"]>(),
  })),
}));

describe("cSP Report API > 違反レポート > 経路", () => {
  afterEach(() => {
    vi.useRealTimers();
    clearRateLimitBuckets();
  });

  it("jSON report / 検証: 受付 / 期待: 204で記録する", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/csp-report", {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "request-id-1" },
      body: JSON.stringify({ "csp-report": { "blocked-uri": "inline" } }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(204);
    expect(warnMock).toHaveBeenCalledWith(
      { body: { "csp-report": { "blocked-uri": "inline" } }, requestId: "request-id-1" },
      "CSP violation report received.",
    );
  });

  it("不正JSON report / 検証: 受付 / 期待: 400を返す", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/csp-report", {
      method: "POST",
      headers: { "content-type": "application/csp-report" },
      body: "{",
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toStrictEqual({
      message: "Invalid CSP report payload.",
    });
  });

  it("巨大report / 検証: 受付 / 期待: 413を返す", async () => {
    expect.hasAssertions();
    // Arrange
    const request = new Request("http://localhost/api/csp-report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ "csp-report": { sample: "x".repeat(17_000) } }),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toStrictEqual({
      message: "CSP report payload is too large.",
    });
  });

  it("連続送信 / 検証: rate limit / 期待: 429とretry-afterを返す", async () => {
    expect.hasAssertions();
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T00:00:00.000Z"));

    for (let index = 0; index < 120; index++) {
      // oxlint-disable-next-line eslint/no-await-in-loop -- 同じクライアントのリクエストを順に送りレート制限を確認する。
      await POST(buildRequest());
    }

    // Act
    const response = await POST(buildRequest());

    // Assert
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    await expect(response.json()).resolves.toStrictEqual({
      message: "Too many CSP reports.",
    });
  });
});

const buildRequest = () =>
  new Request("http://localhost/api/csp-report", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.20",
    },
    body: JSON.stringify({ "csp-report": { "blocked-uri": "inline" } }),
  });
