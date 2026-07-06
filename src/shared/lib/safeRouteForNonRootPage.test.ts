import type { Logger } from "@shared/lib/logger.ts";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { safeRouteForNonRootPage } from "./safeRouteForNonRootPage.ts";

const createLogger = (): Logger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe("safeRouteForNonRootPage", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger();
  });

  test("path・fullPath・params がすべて有効な場合はそのまま返し、ログを出さないこと", () => {
    const route = {
      path: "/guide/detail/1/",
      fullPath: "/guide/detail/1/?p=1",
      params: { id: "1" },
    };
    const requestUrl = new URL("https://freelance.levtech.jp/guide/detail/1/?p=1");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => ["id"],
      () => ({ id: "fallback" }),
    );

    expect(result).toEqual(route);
    expect(logger.error).not.toHaveBeenCalled();
  });

  test("path が '/' の場合は requestURL.pathname にフォールバックし、error ログを出すこと", () => {
    const route = { path: "/", fullPath: "/guide/", params: {} };
    const requestUrl = new URL("https://freelance.levtech.jp/guide/");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => [],
      () => ({}),
    );

    expect(result.path).toBe("/guide/");
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  test("fullPath が '/' の場合は requestURL の pathname + search にフォールバックすること", () => {
    const route = { path: "/guide/", fullPath: "/", params: {} };
    const requestUrl = new URL("https://freelance.levtech.jp/guide/?p=2");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => [],
      () => ({}),
    );

    expect(result.fullPath).toBe("/guide/?p=2");
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  test("必須の params が欠けている場合はフォールバックの params を返すこと", () => {
    const route = { path: "/guide/detail/1/", fullPath: "/guide/detail/1/", params: {} };
    const requestUrl = new URL("https://freelance.levtech.jp/guide/detail/1/");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => ["id"],
      () => ({ id: "1" }),
    );

    expect(result.params).toEqual({ id: "1" });
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  test("path と fullPath の両方が '/' の場合は両方フォールバックし、error ログが2回出ること", () => {
    const route = { path: "/", fullPath: "/", params: {} };
    const requestUrl = new URL("https://freelance.levtech.jp/word/?p=3");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => [],
      () => ({}),
    );

    expect(result.path).toBe("/word/");
    expect(result.fullPath).toBe("/word/?p=3");
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});
