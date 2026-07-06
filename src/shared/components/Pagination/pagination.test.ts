import { describe, expect, it } from "vitest";
import type { PaginationMeta } from "./pagination.ts";
import {
  createEllipsisPagination,
  createPaginationPath,
  createPaginationRange,
} from "./pagination.ts";

const createMeta = (currentPage: number, totalPages: number): PaginationMeta => ({
  itemCount: 20,
  totalItems: totalPages * 20,
  itemsPerPage: 20,
  totalPages,
  currentPage,
});

const constData = {
  indexLink: "/project/search/",
  pagelink: "p",
  slash: "/",
};

describe("createPaginationPath", () => {
  it("1ページ目は indexLink をそのまま返すこと", () => {
    expect(createPaginationPath(constData, 1)).toBe("/project/search/");
  });

  it("2ページ目以降は pagelink とページ番号を付与すること", () => {
    expect(createPaginationPath(constData, 3)).toBe("/project/search/p3/");
  });

  it("query がある場合はクエリ文字列を付与すること", () => {
    expect(createPaginationPath({ ...constData, query: "order=2" }, 3)).toBe(
      "/project/search/p3/?order=2",
    );
    expect(createPaginationPath({ ...constData, query: "order=2" }, 1)).toBe(
      "/project/search/?order=2",
    );
  });
});

describe("createPaginationRange", () => {
  describe("PC（最大9件表示）", () => {
    it("トータルページ数が最大表示数未満の場合は全ページを返すこと", () => {
      expect(createPaginationRange(createMeta(3, 5), "pc")).toEqual([1, 2, 3, 4, 5]);
    });

    it("1ページ目（先頭側）は1からカウントすること", () => {
      expect(createPaginationRange(createMeta(1, 20), "pc")).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("中間ページは現在のページを中心に表示すること", () => {
      expect(createPaginationRange(createMeta(10, 20), "pc")).toEqual([
        6, 7, 8, 9, 10, 11, 12, 13, 14,
      ]);
    });

    it("末尾側のページは最終ページまでを表示すること", () => {
      expect(createPaginationRange(createMeta(18, 20), "pc")).toEqual([
        12, 13, 14, 15, 16, 17, 18, 19, 20,
      ]);
    });

    it("最終ページでも最終ページまでを表示すること", () => {
      expect(createPaginationRange(createMeta(20, 20), "pc")).toEqual([
        12, 13, 14, 15, 16, 17, 18, 19, 20,
      ]);
    });

    it("トータルページ数が1の場合は1のみ返すこと", () => {
      expect(createPaginationRange(createMeta(1, 1), "pc")).toEqual([1]);
    });
  });

  describe("SP（最大4件表示）", () => {
    it("1ページ目（先頭側）は1からカウントすること", () => {
      expect(createPaginationRange(createMeta(1, 20), "sp")).toEqual([1, 2, 3, 4]);
    });

    it("中間ページは現在のページの前2件からカウントすること", () => {
      expect(createPaginationRange(createMeta(10, 20), "sp")).toEqual([8, 9, 10, 11]);
    });

    it("末尾側のページは最終ページまでを表示すること", () => {
      expect(createPaginationRange(createMeta(19, 20), "sp")).toEqual([17, 18, 19, 20]);
    });
  });
});

describe("createEllipsisPagination", () => {
  describe("PC（maxCount: 17）", () => {
    it("先頭ページの場合は末尾側のみ三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(1, 30), 17);
      expect(result.insidePages).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
      expect(result.showLeadingEllipsis).toBe(false);
      expect(result.showTrailingEllipsis).toBe(true);
    });

    it("中間ページの場合は両側に三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(15, 30), 17);
      expect(result.insidePages).toEqual([
        8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      ]);
      expect(result.showLeadingEllipsis).toBe(true);
      expect(result.showTrailingEllipsis).toBe(true);
    });

    it("最終ページの場合は先頭側のみ三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(30, 30), 17);
      expect(result.insidePages).toEqual([
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      ]);
      expect(result.showLeadingEllipsis).toBe(true);
      expect(result.showTrailingEllipsis).toBe(false);
    });

    it("省略される数値が1つだけの場合は三点リーダーの代わりに数値を表示すること", () => {
      // insidePages の末尾が totalPages - 2 になるケース
      const result = createEllipsisPagination(createMeta(1, 19), 17);
      expect(result.insidePages).toEqual([
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ]);
      expect(result.showTrailingEllipsis).toBe(false);
    });
  });

  describe("SP（maxCount: 6）", () => {
    it("先頭ページの場合は末尾側のみ三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(1, 30), 6);
      expect(result.insidePages).toEqual([2, 3, 4, 5, 6]);
      expect(result.showLeadingEllipsis).toBe(false);
      expect(result.showTrailingEllipsis).toBe(true);
    });

    it("中間ページの場合は両側に三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(15, 30), 6);
      expect(result.showLeadingEllipsis).toBe(true);
      expect(result.showTrailingEllipsis).toBe(true);
      expect(result.insidePages).toContain(15);
    });

    it("最終ページの場合は先頭側のみ三点リーダーを表示すること", () => {
      const result = createEllipsisPagination(createMeta(30, 30), 6);
      expect(result.showLeadingEllipsis).toBe(true);
      expect(result.showTrailingEllipsis).toBe(false);
      expect(result.insidePages.slice(-1)[0]).toBe(29);
    });
  });
});
