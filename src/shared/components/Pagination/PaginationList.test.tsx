import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaginationList } from "./PaginationList.tsx";
import { PaginationListEllipsis } from "./PaginationListEllipsis.tsx";
import type { PaginationMeta } from "./pagination.ts";

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

describe("PaginationList", () => {
  it("現在のページはリンクにならないこと", () => {
    render(
      <PaginationList
        paginationMeta={createMeta(3, 10)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "4" })).toHaveAttribute("href", "/project/search/p4/");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("href", "/project/search/p2/");
  });

  it("1ページ目では最初のページへのリンクが表示されないこと", () => {
    render(
      <PaginationList
        paginationMeta={createMeta(1, 10)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.queryByRole("link", { name: "最初のページ" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "最後のページ" })).toHaveAttribute(
      "href",
      "/project/search/p10/",
    );
  });

  it("最終ページでは最後のページへのリンクが表示されないこと", () => {
    render(
      <PaginationList
        paginationMeta={createMeta(10, 10)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.queryByRole("link", { name: "最後のページ" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "最初のページ" })).toHaveAttribute(
      "href",
      "/project/search/",
    );
  });

  it("PC では Prev / Next のテキストが表示されること", () => {
    render(
      <PaginationList
        paginationMeta={createMeta(3, 10)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("SP では Prev / Next のテキストが表示されず最大4ページ表示になること", () => {
    render(
      <PaginationList
        paginationMeta={createMeta(1, 10)}
        paginationConstData={constData}
        device="sp"
      />,
    );

    expect(screen.queryByText("Prev")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });
});

describe("PaginationListEllipsis", () => {
  it("トータルページ数が maxCount 以下の場合は全ページを表示すること", () => {
    render(
      <PaginationListEllipsis
        paginationMeta={createMeta(3, 10)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.queryByText("…")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "10" })).toHaveAttribute(
      "href",
      "/project/search/p10/",
    );
  });

  it("中間ページでは両側に三点リーダーが表示されること", () => {
    render(
      <PaginationListEllipsis
        paginationMeta={createMeta(15, 30)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.getAllByText("…")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/project/search/");
    expect(screen.getByRole("link", { name: "30" })).toHaveAttribute(
      "href",
      "/project/search/p30/",
    );
    expect(screen.queryByRole("link", { name: "15" })).not.toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("1ページ目では前のページリンクが無効になること", () => {
    render(
      <PaginationListEllipsis
        paginationMeta={createMeta(1, 30)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.getAllByText("…")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "前のページ" }).className).toContain("isUnavailable");
  });

  it("最終ページでは次のページリンクが無効になること", () => {
    render(
      <PaginationListEllipsis
        paginationMeta={createMeta(30, 30)}
        paginationConstData={constData}
        device="pc"
      />,
    );

    expect(screen.getByRole("link", { name: "次のページ" }).className).toContain("isUnavailable");
  });

  it("query がある場合はリンクにクエリ文字列が付与されること", () => {
    render(
      <PaginationListEllipsis
        paginationMeta={createMeta(3, 10)}
        paginationConstData={{ ...constData, query: "order=2" }}
        device="pc"
      />,
    );

    expect(screen.getByRole("link", { name: "10" })).toHaveAttribute(
      "href",
      "/project/search/p10/?order=2",
    );
  });
});
