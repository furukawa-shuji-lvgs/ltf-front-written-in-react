import { describe, expect, vi, it } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { safeRouteForNonRootPage } from "./safeRouteForNonRootPage.ts";

const createLogger = (): Logger => ({
  info: vi.fn<Logger["info"]>(),
  warn: vi.fn<Logger["warn"]>(),
  error: vi.fn<Logger["error"]>(),
});

describe(safeRouteForNonRootPage, () => {
  it("path・fullPath・params がすべて有効な場合はそのまま返し、ログを出さないこと", () => {
    expect.hasAssertions();
    const logger = createLogger();
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

    expect(result).toStrictEqual(route);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("path が '/' の場合は requestURL.pathname にフォールバックし、error ログを出すこと", () => {
    expect.hasAssertions();
    const logger = createLogger();
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
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("fullPath が '/' の場合は requestURL の pathname + search にフォールバックすること", () => {
    expect.hasAssertions();
    const logger = createLogger();
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
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("必須の params が欠けている場合はフォールバックの params を返すこと", () => {
    expect.hasAssertions();
    const logger = createLogger();
    const route = { path: "/guide/detail/1/", fullPath: "/guide/detail/1/", params: {} };
    const requestUrl = new URL("https://freelance.levtech.jp/guide/detail/1/");

    const result = safeRouteForNonRootPage(
      route,
      logger,
      requestUrl,
      () => ["id"],
      () => ({ id: "1" }),
    );

    expect(result.params).toStrictEqual({ id: "1" });
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("path と fullPath の両方が '/' の場合は両方フォールバックし、error ログが2回出ること", () => {
    expect.hasAssertions();
    const logger = createLogger();
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
