import { resolvePageRoute } from "@features/routeCatalog/routeMatcher.ts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LegacyVrtPageShell } from "./LegacyVrtPageShell.tsx";

describe("LegacyVrtPageShell", () => {
  it("ガイド詳細 / 検証: ページ表示 / 期待: ページタイトルと主要導線を表示", () => {
    const match = resolvePageRoute(["guide", "detail", "123"]);
    if (!match) {
      throw new Error("guide detail route should resolve");
    }

    render(
      <LegacyVrtPageShell match={match}>
        <p>ガイド詳細本文</p>
      </LegacyVrtPageShell>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "フリーランスガイド記事" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "案件を探す" })).toHaveAttribute(
      "href",
      "/project/search",
    );
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("案件検索 / 検証: Shell描画 / 期待: 子要素を表示", () => {
    const match = resolvePageRoute(["project", "search"]);
    if (!match) {
      throw new Error("project search route should resolve");
    }

    render(
      <LegacyVrtPageShell match={match}>
        <p>案件検索本文</p>
      </LegacyVrtPageShell>,
    );

    expect(screen.getByText("案件検索本文")).toBeInTheDocument();
  });
});
