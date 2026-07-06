import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/csp-report/route.ts";
import { clearRateLimitBuckets } from "@/shared/lib/rateLimit.ts";

const { warnMock } = vi.hoisted(() => ({
  warnMock: vi.fn(),
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    warn: warnMock,
  })),
}));

afterEach(() => {
  vi.useRealTimers();
  clearRateLimitBuckets();
});

describe("CSP Report API > 違反レポート > 経路", () => {
  it("JSON report / 検証: 受付 / 期待: 204で記録する", async () => {
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
    await expect(response.json()).resolves.toEqual({
      message: "Invalid CSP report payload.",
    });
  });

  it("巨大report / 検証: 受付 / 期待: 413を返す", async () => {
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
    await expect(response.json()).resolves.toEqual({
      message: "CSP report payload is too large.",
    });
  });

  it("連続送信 / 検証: rate limit / 期待: 429とretry-afterを返す", async () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T00:00:00.000Z"));
    const buildRequest = () =>
      new Request("http://localhost/api/csp-report", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.20",
        },
        body: JSON.stringify({ "csp-report": { "blocked-uri": "inline" } }),
      });

    for (let i = 0; i < 120; i++) {
      await POST(buildRequest());
    }

    // Act
    const response = await POST(buildRequest());

    // Assert
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    await expect(response.json()).resolves.toEqual({
      message: "Too many CSP reports.",
    });
  });
});
