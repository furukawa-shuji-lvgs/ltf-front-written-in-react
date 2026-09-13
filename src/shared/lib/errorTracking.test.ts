import { describe, expect, it, vi } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { buildErrorTrackingPayload, trackError } from "./errorTracking.ts";

const buildLogger = (): Logger => ({
  info: vi.fn<Logger["info"]>(),
  warn: vi.fn<Logger["warn"]>(),
  error: vi.fn<Logger["error"]>(),
});

describe("errorTracking > エラーペイロード > 生成", () => {
  it("サーバーエラー / 検証: Error cause / 期待: nameとmessageを構造化する", () => {
    expect.hasAssertions();
    // Arrange
    const cause = new TypeError("failed to render");

    // Act
    const payload = buildErrorTrackingPayload({
      source: "server",
      message: "render failed",
      cause,
      context: { lifecycle: "uncaughtExceptionMonitor" },
    });

    // Assert
    expect(payload).toMatchObject({
      source: "server",
      message: "render failed",
      cause: { name: "TypeError", message: "failed to render" },
      context: { lifecycle: "uncaughtExceptionMonitor" },
    });
  });
});

describe("errorTracking > エラーログ > 記録", () => {
  it("クライアントエラー / 検証: trackError / 期待: 構造化ログとして出力する", () => {
    expect.hasAssertions();
    // Arrange
    const logger = buildLogger();

    // Act
    trackError(
      {
        source: "client",
        message: "failed",
        digest: "digest-1",
        path: "/guide/",
        userAgent: "Mozilla/5.0",
      },
      logger,
    );

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      {
        error: {
          source: "client",
          message: "failed",
          digest: "digest-1",
          path: "/guide/",
          userAgent: "Mozilla/5.0",
        },
      },
      "Application error tracked.",
    );
  });
});
