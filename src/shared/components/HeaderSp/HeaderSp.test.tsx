import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeaderSp } from "./HeaderSp.tsx";

describe("HeaderSp", () => {
  it("ロゴとナビボタンが表示されること", () => {
    render(<HeaderSp />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByAltText("レバテックフリーランス")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /案件検索/ })).toHaveAttribute(
      "href",
      "/project/search/",
    );
    expect(screen.getByRole("link", { name: /無料登録/ })).toHaveAttribute(
      "href",
      "/member/input/chat/",
    );
  });

  it("初期表示ではグローバルナビメニューが表示されないこと", () => {
    render(<HeaderSp />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("メニューボタンをクリックするとグローバルナビメニューが開くこと", async () => {
    const user = userEvent.setup();
    render(<HeaderSp />);

    await user.click(screen.getByRole("button", { name: /メニュー/ }));

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("案件を探す")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "サービスについて" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "お役立ちコンテンツ" })).toBeInTheDocument();
  });

  it("閉じるボタンをクリックするとグローバルナビメニューが閉じること", async () => {
    const user = userEvent.setup();
    render(<HeaderSp />);

    await user.click(screen.getByRole("button", { name: /メニュー/ }));
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /閉じる/ }));
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("メニュー内のアコーディオンをクリックするとリンクが開閉すること", async () => {
    const user = userEvent.setup();
    render(<HeaderSp />);

    await user.click(screen.getByRole("button", { name: /メニュー/ }));
    expect(screen.queryByRole("link", { name: "サービス紹介" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "サービスについて" }));
    expect(screen.getByRole("link", { name: "サービス紹介" })).toHaveAttribute("href", "/service/");

    await user.click(screen.getByRole("button", { name: "サービスについて" }));
    expect(screen.queryByRole("link", { name: "サービス紹介" })).not.toBeInTheDocument();
  });

  it("人気の絞り込み条件をクリックすると案件リンクが開くこと", async () => {
    const user = userEvent.setup();
    render(<HeaderSp />);

    await user.click(screen.getByRole("button", { name: /メニュー/ }));
    expect(screen.queryByRole("link", { name: "Java" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "人気の絞り込み条件" }));
    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3/");
  });
});
