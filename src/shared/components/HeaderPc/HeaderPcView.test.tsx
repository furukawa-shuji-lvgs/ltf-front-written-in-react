import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HeaderPcView } from "./HeaderPcView.tsx";
import type { HeaderImage, HeaderPcViewData } from "./types.ts";

const { postLoginInflowInfoMock } = vi.hoisted(() => ({
  postLoginInflowInfoMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@shared/lib/loginInflow.ts", () => ({
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

describe("HeaderPcView > グローバルナビ > 表示", () => {
  it("PCヘッダー / 検証: 初期表示 / 期待: h1と無料登録導線を表示", () => {
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
    expect(screen.getByRole("link", { name: /無料登録/ })).toHaveAttribute(
      "href",
      "/member/input/chat",
    );
  });

  it("PCヘッダー / 検証: 案件検索ホバー / 期待: Java案件リンクを表示", async () => {
    const user = userEvent.setup();
    const data = buildViewData();

    render(
      <HeaderPcView
        h1="テスト見出し"
        isFixed={false}
        isSticky={false}
        isLayoutL={false}
        isP={true}
        data={data}
      />,
    );

    await user.hover(screen.getByRole("link", { name: /案件検索/ }));

    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3");
  });

  it("PCヘッダー / 検証: ログイン押下 / 期待: ログイン流入情報を送信", async () => {
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

    await user.click(screen.getByRole("link", { name: /ログイン/ }));

    expect(postLoginInflowInfoMock).toHaveBeenCalledWith("#login");
  });
});
