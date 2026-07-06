import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeaderPc } from "./HeaderPc.tsx";

describe("HeaderPc", () => {
  it("PCヘッダー / 検証: 初期表示 / 期待: ロゴとグローバルナビを表示", () => {
    render(<HeaderPc h1="テスト見出し" />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByAltText("レバテックフリーランス").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /案件検索/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /サービス紹介/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /お役立ちコンテンツ/ })).toBeInTheDocument();
  });

  it("isP false / 検証: 見出し表示 / 期待: h1で表示", () => {
    render(<HeaderPc h1="テスト見出し" />);

    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
  });

  it("isP true / 検証: 見出し表示 / 期待: h1では表示しない", () => {
    render(
      <HeaderPc
        h1="テスト見出し"
        isP={true}
      />,
    );

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText("テスト見出し")).toBeInTheDocument();
  });

  it("固定ヘッダー / 検証: ヘッダーインフォ / 期待: 見出しを表示しない", () => {
    render(
      <HeaderPc
        h1="テスト見出し"
        isFixed={true}
      />,
    );

    expect(screen.queryByText("テスト見出し")).not.toBeInTheDocument();
  });

  it("PCヘッダー / 検証: 案件検索メニューの開閉 / 期待: Java案件リンクを表示して閉じる", async () => {
    const user = userEvent.setup();

    render(<HeaderPc h1="テスト見出し" />);

    const projectLink = screen.getByRole("link", { name: /案件検索/ });
    expect(projectLink).toHaveAttribute("aria-expanded", "false");

    await user.hover(projectLink);

    expect(projectLink).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("よく検索されるキーワード")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3");

    await user.unhover(projectLink);

    expect(projectLink).toHaveAttribute("aria-expanded", "false");
  });

  it("PCヘッダー / 検証: サービス紹介メニュー / 期待: ご利用の流れリンクを表示", async () => {
    const user = userEvent.setup();

    render(<HeaderPc h1="テスト見出し" />);

    const serviceLink = screen.getByRole("link", { name: /サービス紹介/ });

    await user.hover(serviceLink);

    expect(serviceLink).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "ご利用の流れ" })).toHaveAttribute(
      "href",
      "/service/#flow",
    );
    expect(screen.getByRole("link", { name: "ご友人紹介" })).toBeInTheDocument();
  });

  it("PCヘッダー / 検証: 複数メニューのホバー / 期待: 最後のメニューだけ開く", async () => {
    const user = userEvent.setup();

    render(<HeaderPc h1="テスト見出し" />);

    const projectLink = screen.getByRole("link", { name: /案件検索/ });
    const guideLink = screen.getByRole("link", { name: /お役立ちコンテンツ/ });

    await user.hover(projectLink);
    await user.hover(guideLink);

    expect(projectLink).toHaveAttribute("aria-expanded", "false");
    expect(guideLink).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "ご利用者インタビュー" })).toBeInTheDocument();
  });
});
