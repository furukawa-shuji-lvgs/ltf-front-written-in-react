import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { APP_ROOT_SELECTOR } from "./fixtures/allPages.ts";

const waitForApp = async (page: import("@playwright/test").Page) => {
  await expect(page.locator(APP_ROOT_SELECTOR)).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
};

const analyzeSemanticAccessibility = async (page: import("@playwright/test").Page) => {
  const result = await new AxeBuilder({ page })
    .include(APP_ROOT_SELECTOR)
    .withRules([
      "aria-allowed-attr",
      "aria-required-attr",
      "aria-roles",
      "aria-valid-attr",
      "button-name",
      "image-alt",
      "input-image-alt",
      "label",
      "link-name",
    ])
    .analyze();

  return result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
};

test.describe("アクセシビリティUX > ランドマークと名前 > 経路", () => {
  test("トップ / 検証: 主要ランドマーク / 期待: banner、main、contentinfoを認識できる", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    await expect(page.getByRole("banner").first()).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo").first()).toBeVisible();
  });

  test("SPトップ / 検証: グローバルメニュー / 期待: dialogとして開きaria-modalを持つ", async ({
    page,
  }) => {
    test.skip(test.info().project.name !== "sp", "SP専用のグローバルメニュー挙動");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    await page.getByRole("button", { name: /メニュー/ }).click();

    const dialog = page.getByRole("dialog", { name: "グローバルメニュー" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("トップ / 検証: 検索フォーム名 / 期待: searchboxをroleで取得できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    await expect(page.getByRole("searchbox", { name: "キーワードで案件を探す" })).toBeVisible();
  });

  test("案件検索 / 検証: 絞り込みフォーム名 / 期待: checkboxをroleで取得できる", async ({
    page,
  }) => {
    await page.goto("/project/search/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    await expect(page.getByRole("checkbox", { name: "サーバーサイドエンジニア" })).toBeVisible();
  });
});

test.describe("アクセシビリティUX > 自動検査 > 経路", () => {
  test("トップ / 検証: セマンティックa11y / 期待: axeの重大な名前付け違反がない", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const violations = await analyzeSemanticAccessibility(page);

    expect(violations).toEqual([]);
  });

  test("案件検索 / 検証: セマンティックa11y / 期待: axeの重大な名前付け違反がない", async ({
    page,
  }) => {
    await page.goto("/project/search/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const violations = await analyzeSemanticAccessibility(page);

    expect(violations).toEqual([]);
  });
});
