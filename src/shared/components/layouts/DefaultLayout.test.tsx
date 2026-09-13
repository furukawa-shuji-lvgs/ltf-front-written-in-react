import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { getDevice } from "@shared/lib/device.ts";

import { DefaultLayout } from "./DefaultLayout.tsx";

const { getDeviceMock } = vi.hoisted(() => ({ getDeviceMock: vi.fn<typeof getDevice>() }));

vi.mock(import("@shared/lib/device"), () => ({
  getDevice: getDeviceMock,
}));

describe(DefaultLayout, () => {
  beforeEach(() => {
    getDeviceMock.mockReset();
  });

  it("pC の場合は PC 用ヘッダー・フッターで children を挟むこと", async () => {
    expect.hasAssertions();
    getDeviceMock.mockResolvedValue("pc");

    render(await DefaultLayout({ h1: "テスト見出し", children: <main>コンテンツ</main> }));

    // 通常ヘッダー + 追従ヘッダー
    expect(screen.getAllByRole("banner")).toHaveLength(2);
    expect(screen.getByText("コンテンツ")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("おすすめの求人・案件一覧")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
  });

  it("sP の場合は SP 用ヘッダー・フッターで children を挟むこと", async () => {
    expect.hasAssertions();
    getDeviceMock.mockResolvedValue("sp");

    render(await DefaultLayout({ h1: "テスト見出し", children: <main>コンテンツ</main> }));

    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getByText("コンテンツ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "東京都(23区)" })).toHaveAttribute(
      "href",
      "/project/district-1",
    );
    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
  });

  it("isP が true の場合は h1 タグで見出しを表示しないこと", async () => {
    expect.hasAssertions();
    getDeviceMock.mockResolvedValue("sp");

    render(
      await DefaultLayout({ h1: "テスト見出し", isP: true, children: <main>コンテンツ</main> }),
    );

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText("テスト見出し")).toBeInTheDocument();
  });
});
