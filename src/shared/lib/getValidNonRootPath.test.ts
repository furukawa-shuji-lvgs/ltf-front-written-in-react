import { beforeEach, describe, expect, test, vi } from "vitest";

const { mockWarn, mockError } = vi.hoisted(() => ({
  mockWarn: vi.fn(),
  mockError: vi.fn(),
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    warn: mockWarn,
    error: mockError,
  })),
}));

import { getValidNonRootPath } from "./getValidNonRootPath.ts";

describe("getValidNonRootPath", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("path が有効な場合は path をそのまま返すこと", () => {
    expect(getValidNonRootPath({ path: "/guide/", fullPath: "/guide/?p=1" })).toBe("/guide/");
    expect(mockWarn).not.toHaveBeenCalled();
    expect(mockError).not.toHaveBeenCalled();
  });

  test("path が '/' の場合は fullPath からクエリ・ハッシュを除いて返し、warn ログを出すこと", () => {
    expect(getValidNonRootPath({ path: "/", fullPath: "/guide/?p=1#top" })).toBe("/guide/");
    expect(mockWarn).toHaveBeenCalledTimes(1);
  });

  test("path が undefined の場合も fullPath にフォールバックすること", () => {
    expect(getValidNonRootPath({ fullPath: "/word/" })).toBe("/word/");
    expect(mockWarn).toHaveBeenCalledTimes(1);
  });

  test("fullPath がクエリストリングから始まる場合は requestUrlPathname にフォールバックすること", () => {
    expect(
      getValidNonRootPath({ path: "/", fullPath: "?p=1", requestUrlPathname: "/guide/" }),
    ).toBe("/guide/");
    expect(mockWarn).toHaveBeenCalledTimes(1);
  });

  test("path と fullPath が無効な場合は requestUrlPathname を返し、warn ログを出すこと", () => {
    expect(getValidNonRootPath({ path: "/", fullPath: "/", requestUrlPathname: "/help/" })).toBe(
      "/help/",
    );
    expect(mockWarn).toHaveBeenCalledTimes(1);
  });

  test("すべて無効な場合は null を返し、error ログを出すこと", () => {
    expect(getValidNonRootPath({ path: "/", fullPath: "/", requestUrlPathname: "/" })).toBeNull();
    expect(getValidNonRootPath({})).toBeNull();
    expect(mockError).toHaveBeenCalledTimes(2);
  });
});
