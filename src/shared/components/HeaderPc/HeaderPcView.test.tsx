import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { postLoginInflowInfo } from "@shared/lib/loginInflow.ts";

import type { HeaderImage, HeaderPcViewData } from "./types.ts";

import { HeaderPcView } from "./HeaderPcView.tsx";

const { postLoginInflowInfoMock } = vi.hoisted(() => ({
  postLoginInflowInfoMock: vi.fn<typeof postLoginInflowInfo>().mockResolvedValue(),
}));

vi.mock(import("@shared/lib/loginInflow.ts"), () => ({
  postLoginInflowInfo: postLoginInflowInfoMock,
}));

const buildImage = (alt = ""): HeaderImage => ({
  src: "/icon.svg",
  width: 24,
  height: 24,
  alt,
});

const buildViewData = (): HeaderPcViewData => ({
  headerInfoLinks: [{ text: "IT・Web求人/転職", href: "https://example.com/career" }],
  logo: {
    href: "/",
    dataClickLabel: "logo",
    image: buildImage("レバテックフリーランス"),
  },
  projectNav: {
    name: "案件検索",
    path: "/project/search",
    dataClickLabel: "project",
    dropdown: {
      title: "よく検索されるキーワード",
      categories: [
        {
          title: { icon: buildImage(""), text: "スキル" },
          links: [{ href: "/project/skill-3", text: "Java", dataClickLabel: "java" }],
        },
      ],
      searchLinks: {
        refinement: {
          href: "/project/search",
          text: "条件を指定して検索",
          dataClickLabel: "refinement",
        },
        ai: { href: "/project/ai", text: "AIで検索", dataClickLabel: "ai" },
      },
    },
  },
  commonNavs: [
    {
      menuKey: "service",
      name: "サービス紹介",
      dropdownHeaderName: "サービス紹介",
      path: "/service",
      dataClickLabel: "service",
      links: [
        {
          href: "/service/#flow",
          text: "ご利用の流れ",
          target: "",
          dataClickLabel: "flow",
          icon: null,
        },
      ],
    },
  ],
  recruit: {
    href: "https://example.com/recruit",
    text: "採用企業の方へ",
    target: "_blank",
  },
  login: {
    href: "#login",
    text: "ログイン",
    icon: buildImage("icon_login"),
    dataClickLabel: "login",
  },
  register: {
    href: "/member/input/chat",
    lineLeft: "\\",
    lineRight: "/",
    prefix: "簡単30秒",
    text: "無料登録",
    dataClickLabel: "register",
  },
});

describe("headerPcView > グローバルナビ > 表示", () => {
  it("pCヘッダー / 検証: 初期表示 / 期待: h1と無料登録導線を表示", () => {
    expect.hasAssertions();
    const data = buildViewData();

    render(
      <HeaderPcView
        h1="テスト見出し"
        isFixed={false}
        isSticky={false}
        isLayoutL={false}
        isP={false}
        data={data}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /無料登録/u })).toHaveAttribute(
      "href",
      "/member/input/chat",
    );
  });

  it("pCヘッダー / 検証: 案件検索ホバー / 期待: Java案件リンクを表示", async () => {
    expect.hasAssertions();
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderPcView
        h1="テスト見出し"
        isFixed={false}
        isSticky={false}
        isLayoutL={false}
        isP
        data={data}
      />,
    );

    await user.hover(screen.getByRole("link", { name: /案件検索/u }));

    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3");
  });

  it("pCヘッダー / 検証: ログイン押下 / 期待: ログイン流入情報を送信", async () => {
    expect.hasAssertions();
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderPcView
        h1="テスト見出し"
        isFixed={false}
        isSticky={false}
        isLayoutL={false}
        isP={false}
        data={data}
      />,
    );

    await user.click(screen.getByRole("link", { name: /ログイン/u }));

    expect(postLoginInflowInfoMock).toHaveBeenCalledWith("#login");
  });

  it("メニュー内外のフォーカス移動 / 検証: 開閉状態 / 期待: メニュー内では開き外へ移ると閉じる", () => {
    expect.hasAssertions();
    render(
      <HeaderPcView
        h1="テスト見出し"
        isFixed={false}
        isSticky={false}
        isLayoutL={false}
        isP={false}
        data={buildViewData()}
      />,
    );
    const projectLink = screen.getByRole("link", { name: /案件検索/u });

    act(() => {
      projectLink.focus();
    });
    expect(projectLink).toHaveAttribute("aria-expanded", "true");

    act(() => {
      screen.getByRole("link", { name: "Java" }).focus();
    });
    expect(projectLink).toHaveAttribute("aria-expanded", "true");

    act(() => {
      screen.getByRole("link", { name: /無料登録/u }).focus();
    });
    expect(projectLink).toHaveAttribute("aria-expanded", "false");
  });
});
