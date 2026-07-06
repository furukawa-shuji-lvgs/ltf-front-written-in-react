import type { Device } from "@shared/lib/device.ts";

export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationConstData {
  indexLink: string;
  pagelink: string;
  slash: string;
  query?: string;
}

/** ページ番号からリンク先パスを組み立てる（1ページ目は indexLink そのまま） */
export const createPaginationPath = (constData: PaginationConstData, page: number): string => {
  const pageLink = page > 1 ? constData.pagelink + page + constData.slash : "";
  const path = constData.indexLink + pageLink;
  if (!constData.query) return path;

  return `${path}?${constData.query}`;
};

/**
 * ページネーション用数値の配列生成処理（旧 Molecules/Pagination/PaginationList.vue）
 * 最大表示数は PC: 9件、SP: 4件
 */
export const createPaginationRange = (meta: PaginationMeta, device: Device): number[] => {
  const maxPages = device === "sp" ? 4 : 9;
  // 表示数（トータルページ数が最大表示数以下の場合はトータルページ数）
  const showTotalPages = meta.totalPages < maxPages ? meta.totalPages : maxPages;
  // 現在のページを除いたページ表示数
  const ignoreCurrentPages = showTotalPages - 1;
  // 現在のページの両端に表示される最大ページネーション数
  const bothSidesPaginationNumber =
    device === "sp" ? Math.floor(maxPages / 2) : Math.floor(ignoreCurrentPages / 2);

  return [...Array(showTotalPages)].map((_, i) => {
    if (meta.totalPages <= showTotalPages || meta.currentPage <= bothSidesPaginationNumber) {
      return i + 1;
    }
    if (meta.totalPages - meta.currentPage <= bothSidesPaginationNumber) {
      return i + (meta.totalPages - ignoreCurrentPages);
    }
    return i + (meta.currentPage - bothSidesPaginationNumber);
  });
};

export interface EllipsisPagination {
  /** 両端（1 と totalPages）を除いた内側に表示するページ番号 */
  insidePages: number[];
  /** 先頭側に三点リーダーを表示するか */
  showLeadingEllipsis: boolean;
  /** 末尾側に三点リーダーを表示するか */
  showTrailingEllipsis: boolean;
}

/**
 * 三点リーダー付きページネーションの内側配列生成処理
 * （旧 Molecules/Pagination/PaginationListEllipsis.vue）
 * @param maxCount 表示するリストアイテム数の最大値（PC: 17、SP: 6）
 */
export const createEllipsisPagination = (
  meta: PaginationMeta,
  maxCount: number,
): EllipsisPagination => {
  const maxInsidePageNum = meta.totalPages - 1;
  const minInsidePageNum = 1 + 1;
  const insidePages: number[] = [];
  // 内側配列で現在のページより前に表示する値の数
  // （表示最大個数 - 両端の常に表示される値の個数(2) - 真ん中の現在の値の個数(1)）
  const previousBuffer = Math.floor((maxCount - 2 - 1) / 2);

  let start = minInsidePageNum;
  let insidePageCount = maxCount;

  // 内側配列が3以上からスタートする際の配列スタート値設定
  if (meta.currentPage - previousBuffer > minInsidePageNum + 1) {
    start = meta.currentPage - previousBuffer;
  }
  // 三点リーダー表示する際の内側配列のアイテム数の調整
  if (meta.currentPage - previousBuffer > minInsidePageNum + 1) {
    insidePageCount--;
  }
  if (meta.currentPage + previousBuffer < meta.totalPages - 2) {
    insidePageCount--;
  }
  // 内側配列の最後の値が内側配列の最大値を超える場合はスタート値を調整
  if (start + insidePageCount - 1 > maxInsidePageNum) {
    start = meta.totalPages - insidePageCount;
  }

  for (let i = 0; i < insidePageCount; i++) {
    insidePages.push(start + i);
  }
  // 省略されている数値が（内側配列の最大値 - 1）だった場合は三点リーダーの代わりに数値を表示する
  if (insidePages.slice(-1)[0] === meta.totalPages - 2) {
    insidePages.push(maxInsidePageNum);
  }

  return {
    insidePages,
    showLeadingEllipsis: (insidePages[0] || 0) > 2,
    showTrailingEllipsis: (insidePages.slice(-1)[0] || 0) < meta.totalPages - 2,
  };
};
