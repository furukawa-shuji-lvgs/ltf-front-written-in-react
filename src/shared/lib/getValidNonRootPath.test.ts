import { beforeEach, describe, expect, vi, it } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { getValidNonRootPath } from "./getValidNonRootPath.ts";

const { mockWarn, mockError } = vi.hoisted(() => ({
  mockWarn: vi.fn<Logger["warn"]>(),
  mockError: vi.fn<Logger["error"]>(),
}));

vi.mock(import("@shared/lib/logger"), () => ({
  getLogger: vi.fn<() => Logger>(() => ({
    warn: mockWarn,
    error: mockError,
    info: vi.fn<Logger["info"]>(),
  })),
}));

describe(getValidNonRootPath, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("path が有効な場合は path をそのまま返すこと", () => {
    expect.hasAssertions();
    expect(getValidNonRootPath({ path: "/guide/", fullPath: "/guide/?p=1" })).toBe("/guide/");
    expect(mockWarn).not.toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
  });

  it("path が '/' の場合は fullPath からクエリ・ハッシュを除いて返し、warn ログを出すこと", () => {
    expect.hasAssertions();
    expect(getValidNonRootPath({ path: "/", fullPath: "/guide/?p=1#top" })).toBe("/guide/");
    expect(mockWarn).toHaveBeenCalledOnce();
  });

  it("path が undefined の場合も fullPath にフォールバックすること", () => {
    expect.hasAssertions();
    expect(getValidNonRootPath({ fullPath: "/word/" })).toBe("/word/");
    expect(mockWarn).toHaveBeenCalledOnce();
  });

  it("fullPath がクエリストリングから始まる場合は requestUrlPathname にフォールバックすること", () => {
    expect.hasAssertions();
    expect(
      getValidNonRootPath({ path: "/", fullPath: "?p=1", requestUrlPathname: "/guide/" }),
    ).toBe("/guide/");
    expect(mockWarn).toHaveBeenCalledOnce();
  });

  it("path と fullPath が無効な場合は requestUrlPathname を返し、warn ログを出すこと", () => {
    expect.hasAssertions();
    expect(getValidNonRootPath({ path: "/", fullPath: "/", requestUrlPathname: "/help/" })).toBe(
      "/help/",
    );
    expect(mockWarn).toHaveBeenCalledOnce();
  });

  it("すべて無効な場合は null を返し、error ログを出すこと", () => {
    expect.hasAssertions();
    expect(getValidNonRootPath({ path: "/", fullPath: "/", requestUrlPathname: "/" })).toBeNull();
    expect(getValidNonRootPath({})).toBeNull();
    expect(mockError).toHaveBeenCalledTimes(2);
  });
});
