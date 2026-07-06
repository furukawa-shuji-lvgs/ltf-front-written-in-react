import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { generateMetadata } from "@/app/[[...slug]]/page.tsx";

describe("App Router catch-all page", () => {
  it("案件検索 / 検証: Nuxt互換ルート描画 / 期待: 職種選択ウィザードを表示", async () => {
    const element = await Page({
      params: Promise.resolve({ slug: ["project", "search"] }),
    });

    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "フリーランス案件検索" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "サーバーサイドエンジニア" })).toBeInTheDocument();
  });

  it("ガイド詳細 / 検証: metadata生成 / 期待: canonicalを動的パスで返す", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: ["guide", "detail", "123"] }),
    });

    expect(metadata.title).toBe("フリーランスガイド記事");
    expect(metadata.alternates).toEqual({ canonical: "http://localhost:3000/guide/detail/123/" });
  });
});
