import { expect, test } from "@playwright/test";

test.describe("移行済みページ smoke", () => {
  test("トップページが表示されること", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "ITフリーランスエンジニアの求人・案件" }),
    ).toBeVisible();
  });

  test("ガイド詳細ページが表示されること", async ({ page }) => {
    await page.goto("/guide/detail/123/");
    await expect(
      page.getByRole("heading", {
        name: /フリーランスガイド記事|フリーランスエンジニアが案件を選ぶときのチェックポイント/,
      }),
    ).toBeVisible();
  });

  test("案件検索ページが表示されること", async ({ page }) => {
    await page.goto("/project/search/");
    await expect(page.getByRole("heading", { name: "フリーランス案件検索" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "サーバーサイドエンジニア" })).toBeVisible();
  });
});
