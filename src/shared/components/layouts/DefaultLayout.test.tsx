import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultLayout } from "./DefaultLayout.tsx";

const { getDeviceMock } = vi.hoisted(() => ({ getDeviceMock: vi.fn() }));

vi.mock("@shared/lib/device", () => ({
  getDevice: getDeviceMock,
}));

describe("DefaultLayout", () => {
  beforeEach(() => {
    getDeviceMock.mockReset();
  });

  it("PC の場合は PC 用ヘッダー・フッターで children を挟むこと", async () => {
    getDeviceMock.mockResolvedValue("pc");

    render(await DefaultLayout({ h1: "テスト見出し", children: <main>コンテンツ</main> }));

    expect(screen.getAllByRole("banner").length).toBe(2); // 通常ヘッダー + 追従ヘッダー
    expect(screen.getByText("コンテンツ")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("おすすめの求人・案件一覧")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
  });

  it("SP の場合は SP 用ヘッダー・フッターで children を挟むこと", async () => {
    getDeviceMock.mockResolvedValue("sp");

    render(await DefaultLayout({ h1: "テスト見出し", children: <main>コンテンツ</main> }));

    expect(screen.getAllByRole("banner").length).toBe(1);
    expect(screen.getByText("コンテンツ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "東京都(23区)" })).toHaveAttribute(
      "href",
      "/project/district-1",
    );
    expect(screen.getByRole("heading", { level: 1, name: "テスト見出し" })).toBeInTheDocument();
  });

  it("isP が true の場合は h1 タグで見出しを表示しないこと", async () => {
    getDeviceMock.mockResolvedValue("sp");

    render(
      await DefaultLayout({ h1: "テスト見出し", isP: true, children: <main>コンテンツ</main> }),
    );

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText("テスト見出し")).toBeInTheDocument();
  });
});
