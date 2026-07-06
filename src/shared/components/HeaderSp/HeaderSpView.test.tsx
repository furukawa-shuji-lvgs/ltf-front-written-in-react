import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeaderSpView } from "./HeaderSpView.tsx";
import type { HeaderSpImage, HeaderSpViewData } from "./types.ts";

const { postLoginInflowInfoMock } = vi.hoisted(() => ({
  postLoginInflowInfoMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@shared/lib/loginInflow.ts", () => ({
  postLoginInflowInfo: postLoginInflowInfoMock,
}));

const buildImage = (alt = ""): HeaderSpImage => ({
  src: "/icon.svg",
  width: 24,
  height: 24,
  alt,
});

const buildViewData = (): HeaderSpViewData => ({
  logo: {
    href: "/",
    dataClickLabel: "logo",
    image: buildImage("レバテックフリーランス"),
  },
  leftButtons: [
    {
      icon: buildImage(""),
      href: "/project/search/",
      target: "",
      rel: "",
      text: "案件検索",
      isCta: false,
      isMenu: false,
      dataClickLabel: "search",
    },
  ],
  rightButtons: [
    {
      icon: buildImage(""),
      href: null,
      target: "",
      rel: "",
      text: "メニュー",
      isCta: false,
      isMenu: true,
      dataClickLabel: "menu",
    },
  ],
  navHead: {
    logo: {
      href: "/",
      dataClickLabel: "nav-logo",
      image: buildImage("レバテックフリーランス"),
    },
    register: {
      href: "/member/input/chat/",
      text: "無料登録",
      dataClickLabel: "register",
    },
    close: {
      text: "閉じる",
      dataClickLabel: "close",
    },
  },
  projectMenu: {
    title: "案件を探す",
    category: {
      title: "開発言語・スキルで探す",
      links: [{ href: "/project/skill-3/", text: "Java", dataClickLabel: "java" }],
      cta: { href: "/project/search/", text: "条件を指定して探す", dataClickLabel: "search-cta" },
    },
    link: { href: "/project/search/", text: "案件一覧", dataClickLabel: "project-list" },
  },
  serviceMenu: {
    title: "サービス",
    links: [
      {
        href: "/service/",
        text: "サービス紹介",
        target: "",
        dataClickLabel: "service",
        logo: null,
      },
    ],
  },
  usefulMenu: {
    title: "お役立ち",
    links: [{ href: "/guide/", text: "ガイド", target: "", dataClickLabel: "guide", logo: null }],
  },
  companyLink: {
    href: "https://example.com/company",
    text: "会社情報",
    logo: buildImage(""),
    dataClickLabel: "company",
  },
  login: {
    href: "#login",
    text: "ログイン",
    dataClickLabel: "login",
  },
});

afterEach(() => {
  document.body.style.overflow = "";
});

describe("HeaderSpView > グローバルメニュー > 開閉", () => {
  it("SPヘッダー / 検証: メニュー押下 / 期待: 登録導線を表示", async () => {
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );

    await user.click(screen.getByRole("button", { name: "メニュー" }));

    const nav = screen.getByRole("navigation");
    expect(
      within(nav).getByRole("link", { name: /無料登録/ }),
      "メニュー内の無料登録導線が表示される",
    ).toHaveAttribute("href", "/member/input/chat/");
  });

  it("SPヘッダー / 検証: 案件カテゴリ展開 / 期待: Java案件リンクを表示", async () => {
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );

    await user.click(screen.getByRole("button", { name: "メニュー" }));
    await user.click(screen.getByRole("button", { name: "開発言語・スキルで探す" }));

    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3/");
  });

  it("SPヘッダー / 検証: ログイン押下 / 期待: ログイン流入情報を送信", async () => {
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );

    await user.click(screen.getByRole("button", { name: "メニュー" }));
    await user.click(screen.getByRole("link", { name: "ログイン" }));

    expect(postLoginInflowInfoMock).toHaveBeenCalledWith("#login");
  });

  it("SPヘッダー / 検証: メニュー表示 / 期待: bodyスクロールをロックして閉じるボタンへフォーカス", async () => {
    // Arrange
    const user = userEvent.setup();
    const data = buildViewData();
    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );

    // Act
    await user.click(screen.getByRole("button", { name: "メニュー" }));

    // Assert
    expect(document.body.style.overflow, "メニュー表示中は背景スクロールを止める").toBe("hidden");
    expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus();
  });

  it("SPヘッダー / 検証: Escapeキー / 期待: メニューを閉じて開閉ボタンへフォーカスを戻す", async () => {
    // Arrange
    const user = userEvent.setup();
    const data = buildViewData();
    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );
    const menuButton = screen.getByRole("button", { name: "メニュー" });
    await user.click(menuButton);

    // Act
    await user.keyboard("{Escape}");

    // Assert
    expect(screen.queryByRole("dialog", { name: "グローバルメニュー" })).not.toBeInTheDocument();
    expect(document.body.style.overflow, "メニュー終了時は背景スクロール設定を戻す").toBe("");
    expect(menuButton).toHaveFocus();
  });

  it("SPヘッダー / 検証: Shift+Tab移動 / 期待: フォーカスをメニュー内で循環させる", async () => {
    // Arrange
    const user = userEvent.setup();
    const data = buildViewData();
    render(
      <HeaderSpView
        isStatic={false}
        data={data}
      />,
    );
    await user.click(screen.getByRole("button", { name: "メニュー" }));
    const dialog = screen.getByRole("dialog", { name: "グローバルメニュー" });
    within(dialog).getByRole("link", { name: "レバテックフリーランス" }).focus();

    // Act
    await user.keyboard("{Shift>}{Tab}{/Shift}");

    // Assert
    expect(within(dialog).getByRole("link", { name: "ログイン" })).toHaveFocus();
  });
});
