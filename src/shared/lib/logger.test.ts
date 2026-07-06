import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLogger } from "./logger.ts";

describe("logger > 構造化ログ > 出力", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("文字列message / 検証: info / 期待: pino互換のJSON文字列で出力", () => {
    // Arrange
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const logger = getLogger("test");

    // Act
    logger.info("ready");

    // Assert
    const output = JSON.parse(String(infoSpy.mock.calls[0]?.[0]));
    expect(output).toEqual(
      expect.objectContaining({
        level: "INFO",
        time: "2026-07-05T00:00:00.000Z",
        pid: process.pid,
        hostname: expect.any(String),
        name: "test",
        msg: "ready",
      }),
    );
  });

  it("payload付きmessage / 検証: warn / 期待: payloadをトップレベルに含めて出力", () => {
    // Arrange
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const logger = getLogger("test", { requestId: "request-id-1" });

    // Act
    logger.warn({ path: "/guide/" }, "invalid path");

    // Assert
    const output = JSON.parse(String(warnSpy.mock.calls[0]?.[0]));
    expect(output).toEqual(
      expect.objectContaining({
        level: "WARN",
        time: "2026-07-05T00:00:00.000Z",
        pid: process.pid,
        hostname: expect.any(String),
        name: "test",
        msg: "invalid path",
        requestId: "request-id-1",
        path: "/guide/",
      }),
    );
  });

  it("LOG_LEVEL=error / 検証: warn / 期待: 出力を抑制する", () => {
    // Arrange
    vi.stubEnv("LOG_LEVEL", "error");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const logger = getLogger("test");

    // Act
    logger.warn("invalid path");

    // Assert
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
