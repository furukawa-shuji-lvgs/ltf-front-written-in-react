import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreadcrumbsPc } from "./BreadcrumbsPc.tsx";
import { BreadcrumbsSp } from "./BreadcrumbsSp.tsx";

const breadcrumbs = [
  { text: "トップ", url: "/" },
  { text: "案件検索", url: "/project/search/" },
  { text: "Javaの求人・案件", url: "/project/skill-3/" },
];

describe.each([
  ["BreadcrumbsPc", BreadcrumbsPc],
  ["BreadcrumbsSp", BreadcrumbsSp],
])("%s", (_name, Breadcrumbs) => {
  it("すべてのパンくずが表示されること", () => {
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    expect(screen.getByText("トップ")).toBeInTheDocument();
    expect(screen.getByText("案件検索")).toBeInTheDocument();
    expect(screen.getByText("Javaの求人・案件")).toBeInTheDocument();
  });

  it("最後の要素以外はリンクとして表示されること", () => {
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    expect(screen.getByRole("link", { name: "トップ" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "案件検索" })).toHaveAttribute(
      "href",
      "/project/search",
    );
    expect(screen.queryByRole("link", { name: "Javaの求人・案件" })).not.toBeInTheDocument();
  });

  it("schema.org の構造化データ（microdata）が出力されること", () => {
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    expect(
      container.querySelector('[itemtype="https://schema.org/BreadcrumbList"]'),
    ).toBeInTheDocument();

    const items = container.querySelectorAll('[itemtype="https://schema.org/ListItem"]');
    expect(items).toHaveLength(3);

    const positions = [...container.querySelectorAll('meta[itemprop="position"]')].map((meta) =>
      meta.getAttribute("content"),
    );
    expect(positions).toEqual(["1", "2", "3"]);

    const names = [...container.querySelectorAll('[itemprop="name"]')].map((el) => el.textContent);
    expect(names).toEqual(["トップ", "案件検索", "Javaの求人・案件"]);
  });

  it("パンくずが1件の場合はリンクを表示しないこと", () => {
    render(<Breadcrumbs breadcrumbs={[{ text: "トップ", url: "/" }]} />);

    expect(screen.getByText("トップ")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
