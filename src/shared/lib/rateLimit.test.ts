import { afterEach, describe, expect, it } from "vitest";

import { checkRateLimit, clearRateLimitBuckets } from "./rateLimit.ts";

describe("rate Limit > In-memory bucket > 経路", () => {
  afterEach(() => {
    clearRateLimitBuckets();
  });

  it("初回request / 検証: rate limit / 期待: 許可してremainingを減らす", () => {
    expect.hasAssertions();
    // Arrange

    // Act
    const result = checkRateLimit("client-1", { max: 2, windowMs: 60_000, now: fixedNow });

    // Assert
    expect(result).toStrictEqual({ allowed: true, remaining: 1, resetAt: 61_000 });
  });

  it("上限超過request / 検証: rate limit / 期待: 拒否する", () => {
    expect.hasAssertions();
    // Arrange
    checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: fixedNow });

    // Act
    const result = checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: fixedNow });

    // Assert
    expect(result).toStrictEqual({ allowed: false, remaining: 0, resetAt: 61_000 });
  });

  it("window経過後request / 検証: rate limit / 期待: bucketをリセットする", () => {
    expect.hasAssertions();
    // Arrange
    checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: () => 1000 });

    // Act
    const result = checkRateLimit("client-1", { max: 1, windowMs: 60_000, now: () => 61_000 });

    // Assert
    expect(result).toStrictEqual({ allowed: true, remaining: 0, resetAt: 121_000 });
  });
});

const fixedNow = () => 1000;
