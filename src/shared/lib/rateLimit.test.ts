import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, clearRateLimitBuckets } from "./rateLimit.ts";

afterEach(() => {
  clearRateLimitBuckets();
});

describe("Rate Limit > In-memory bucket > 経路", () => {
  it("初回request / 検証: rate limit / 期待: 許可してremainingを減らす", () => {
    // Arrange
    const now = () => 1_000;

    // Act
    const result = checkRateLimit("client-1", { max: 2, windowMs: 60_000, now });

    // Assert
    expect(result).toEqual({ allowed: true, remaining: 1, resetAt: 61_000 });
  });

  it("上限超過request / 検証: rate limit / 期待: 拒否する", () => {
    // Arrange
    const now = () => 1_000;
    checkRateLimit("client-1", { max: 1, windowMs: 60_000, now });

    // Act
    const result = checkRateLimit("client-1", { max: 1, windowMs: 60_000, now });

    // Assert
    expect(result).toEqual({ allowed: false, remaining: 0, resetAt: 61_000 });
  });

  it("window経過後request / 検証: rate limit / 期待: bucketをリセットする", () => {
    // Arrange
    checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: () => 1_000 });

    // Act
    const result = checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: () => 61_000 });

    // Assert
    expect(result).toEqual({ allowed: true, remaining: 0, resetAt: 121_000 });
  });
});
