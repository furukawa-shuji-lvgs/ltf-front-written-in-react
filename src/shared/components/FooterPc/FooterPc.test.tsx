import { LtServices } from "@shared/constants/ltServices.ts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FooterPc } from "./FooterPc.tsx";

describe("FooterPc", () => {
  it("共通リンクが表示されること", () => {
    render(<FooterPc />);

    expect(screen.getByRole("link", { name: "案件一覧" })).toHaveAttribute(
      "href",
      "/project/search",
    );
    expect(screen.getByRole("link", { name: "ヘルプ" })).toHaveAttribute("href", "/help");
    expect(screen.getByRole("link", { name: "サイトマップ" })).toHaveAttribute("href", "/sitemap");
  });

  it("isBrand のリンクはレバテックのホストで解決されること", () => {
    render(<FooterPc />);
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute(
      "href",
      new URL("/legal/", LtServices.LT_URL).href,
    );
  });

  it("外部リンクは別タブで開くこと", () => {
    render(<FooterPc />);
    expect(screen.getByRole("link", { name: "運営会社" })).toHaveAttribute("target", "_blank");
  });

  it("おすすめの求人・案件一覧が表示されること", () => {
    render(<FooterPc />);

    expect(screen.getByText("おすすめの求人・案件一覧")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Javaの求人・案件" })).toHaveAttribute(
      "href",
      "/project/skill-3",
    );
  });

  it("関連サービスのリンクが LtServices の URL で表示されること", () => {
    render(<FooterPc />);
    expect(screen.getByRole("link", { name: "IT転職ならレバテックキャリア" })).toHaveAttribute(
      "href",
      LtServices.LTC_URL,
    );
  });

  it("コピーライトに現在の年が表示されること", () => {
    render(<FooterPc />);
    expect(
      screen.getByText(`© 2017-${new Date().getFullYear()} Levtech Co., Ltd.`),
    ).toBeInTheDocument();
  });

  it("isShowPageTop が false の場合はページトップボタンが表示されないこと", () => {
    render(<FooterPc isShowPageTop={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
