import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaginationListEllipsis } from "./PaginationListEllipsis.tsx";
import type { PaginationConstData, PaginationMeta } from "./pagination.ts";

const buildPaginationMeta = (overrides: Partial<PaginationMeta> = {}): PaginationMeta => ({
  itemCount: 10,
  totalItems: 200,
  itemsPerPage: 10,
  totalPages: 20,
  currentPage: 10,
  ...overrides,
});

const buildPaginationConstData = (
  overrides: Partial<PaginationConstData> = {},
): PaginationConstData => ({
  indexLink: "/guide/",
  pagelink: "p",
  slash: "/",
  ...overrides,
});

describe("PaginationListEllipsis > ページ移動 > リンク生成", () => {
  it("PC一覧 / 検証: 中央ページ表示 / 期待: 前後リンクと省略記号を表示", () => {
    const paginationMeta = buildPaginationMeta({
      totalItems: 300,
      totalPages: 30,
      currentPage: 15,
    });
    const paginationConstData = buildPaginationConstData();

    render(
      <PaginationListEllipsis
        paginationMeta={paginationMeta}
        paginationConstData={paginationConstData}
        device="pc"
      />,
    );

    expect(screen.getByRole("link", { name: "前のページ" })).toHaveAttribute("href", "/guide/p14/");
    expect(screen.getByRole("link", { name: "次のページ" })).toHaveAttribute("href", "/guide/p16/");
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("SP一覧 / 検証: 最大表示数 / 期待: 表示ページ数をSP用に絞る", () => {
    const paginationMeta = buildPaginationMeta({ currentPage: 3 });
    const paginationConstData = buildPaginationConstData();

    render(
      <PaginationListEllipsis
        paginationMeta={paginationMeta}
        paginationConstData={paginationConstData}
        device="sp"
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(1);
  });
});
