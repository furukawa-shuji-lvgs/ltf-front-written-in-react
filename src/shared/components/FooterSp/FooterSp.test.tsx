import { LtServices } from "@shared/constants/ltServices.ts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FooterSp } from "./FooterSp.tsx";

describe("FooterSp", () => {
  it("案件検索リンクがカテゴリごとに表示されること", () => {
    render(<FooterSp />);

    expect(screen.getByText("スキル")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Java" })).toHaveAttribute("href", "/project/skill-3");
    expect(screen.getByText("エリア")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "東京都(23区)" })).toHaveAttribute(
      "href",
      "/project/district-1",
    );
  });

  it("ボトムリンクが表示され isBrand のリンクはレバテックのホストで解決されること", () => {
    render(<FooterSp />);

    expect(screen.getByRole("link", { name: "サイトマップ" })).toHaveAttribute("href", "/sitemap");
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute(
      "href",
      new URL("/legal/", LtServices.LT_URL).href,
    );
  });

  it("関連サービスのリンクが LtServices の URL で表示されること", () => {
    render(<FooterSp />);
    expect(screen.getByRole("link", { name: "IT転職ならレバテックキャリア" })).toHaveAttribute(
      "href",
      LtServices.LTC_URL,
    );
  });

  it("コピーライトに現在の年が表示されること", () => {
    render(<FooterSp />);
    expect(
      screen.getByText(`© 2017-${new Date().getFullYear()} Levtech Co., Ltd.`),
    ).toBeInTheDocument();
  });
});
