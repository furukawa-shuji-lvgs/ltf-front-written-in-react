import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy } from "./csp.ts";

describe("content Security Policy > script nonce > 経路", () => {
  it("本番CSP / 検証: script-src / 期待: nonceを許可しunsafe-inlineを許可しない", () => {
    expect.hasAssertions();
    // Arrange
    const nonce = "nonce123";

    // Act
    const policy = buildContentSecurityPolicy({ nonce, nodeEnv: "production" });

    // Assert
    expect(policy).toContain("script-src 'self' 'nonce-nonce123'");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("'unsafe-eval'");
  });

  it("開発CSP / 検証: script-src / 期待: Next dev server用にunsafe-evalだけ許可する", () => {
    expect.hasAssertions();
    // Arrange
    const nonce = "nonce123";

    // Act
    const policy = buildContentSecurityPolicy({ nonce, nodeEnv: "development" });

    // Assert
    expect(policy).toContain("'unsafe-eval'");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("report-Only CSP / 検証: style-src / 期待: inline style廃止候補をreport-onlyで検証する", () => {
    expect.hasAssertions();
    // Arrange
    const nonce = "nonce123";

    // Act
    const policy = buildContentSecurityPolicy({ nonce, reportOnly: true });

    // Assert
    expect(policy).toContain("style-src 'self'");
    expect(policy).not.toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).toContain("report-uri /api/csp-report");
  });
});
