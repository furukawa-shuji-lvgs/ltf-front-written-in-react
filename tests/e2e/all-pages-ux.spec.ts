import { expect, test } from "@playwright/test";
import { APP_ROOT_SELECTOR, allPageUxRoutes } from "./fixtures/allPages.ts";

const waitForApp = async (page: import("@playwright/test").Page) => {
  await expect(page.locator(APP_ROOT_SELECTOR)).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
};

const openSpGlobalMenu = async (page: import("@playwright/test").Page) => {
  const dialog = page.getByRole("dialog", { name: "グローバルメニュー" });

  await expect(async () => {
    if (!(await dialog.isVisible().catch(() => false))) {
      await page.getByRole("button", { name: /メニュー/ }).click();
    }

    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 30_000 });

  return dialog;
};

test.describe("全ページUX > ページ表示 > 経路", () => {
  for (const route of allPageUxRoutes) {
    test(`${route.slug} / 検証: ページ表示 / 期待: 主要テキストが表示される`, async ({ page }) => {
      const expectedText =
        test.info().project.name === "sp" ? (route.spText ?? route.text) : route.text;

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      expect(response?.status(), `${route.slug} はHTTP 500未満で応答する`).toBeLessThan(500);
      await waitForApp(page);
      await expect(
        page.locator(APP_ROOT_SELECTOR),
        `${route.slug} の主要テキストが表示される`,
      ).toContainText(expectedText);
    });
  }
});

test.describe("共通導線UX > ヘッダー操作 > 経路", () => {
  test("PCトップ / 検証: 案件検索メニュー / 期待: Java案件へ遷移できるリンクを表示", async ({
    page,
  }) => {
    test.setTimeout(45_000);
    test.skip(test.info().project.name !== "pc", "PC専用のグローバルナビ挙動");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const pcNav = page.getByTestId("header-pc-global-nav");
    const projectNav = pcNav.getByRole("link", { name: /案件検索/ });
    const javaLink = pcNav.locator("a[href='/project/skill-3/']").filter({ hasText: /^Java$/ });

    await expect(async () => {
      await projectNav.focus();
      await projectNav.hover();
      await expect(javaLink).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 30_000 });

    await expect(javaLink).toHaveAttribute("href", "/project/skill-3/");
  });

  test("SPトップ / 検証: メニュー開閉 / 期待: 案件検索カテゴリを展開できる", async ({ page }) => {
    test.skip(test.info().project.name !== "sp", "SP専用のグローバルメニュー挙動");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const dialog = await openSpGlobalMenu(page);
    await dialog.getByRole("button", { name: "人気の絞り込み条件" }).click();

    await expect(dialog.getByRole("link", { name: "Java", exact: true })).toHaveAttribute(
      "href",
      "/project/skill-3/",
    );
  });

  test("SPトップ / 検証: メニューEscape / 期待: グローバルメニューを閉じる", async ({ page }) => {
    test.skip(test.info().project.name !== "sp", "SP専用のグローバルメニュー挙動");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const dialog = await openSpGlobalMenu(page);
    await page.keyboard.press("Escape");

    await expect(dialog).not.toBeVisible();
  });
});

test.describe("主要操作UX > 検索とフォーム > 経路", () => {
  test("ガイド / 検証: 流入セッション送信 / 期待: 現在パスをownd-inflow APIへPOST", async ({
    page,
  }) => {
    const requestPromise = page.waitForRequest((request) => {
      return request.method() === "POST" && request.url().endsWith("/api/ownd-inflow/session");
    });

    await page.goto("/guide/?sip=e2e", { waitUntil: "domcontentloaded" });
    await waitForApp(page);
    const request = await requestPromise;

    expect(request.postDataJSON()).toMatchObject({
      fullPath: "/guide/?sip=e2e",
    });
  });

  test("トップ / 検証: キーワード検索 / 期待: 案件検索URLへクエリ付きで遷移", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);
    const searchbox = page.getByRole("searchbox", { name: "キーワードで案件を探す" });

    await searchbox.fill("Java");
    await searchbox.press("Enter");

    await expect(page).toHaveURL(/\/project\/search\/\?keyword=Java$/);
  });

  test("案件検索 / 検証: 職種選択 / 期待: 選択状態が画面に反映される", async ({ page }) => {
    await page.goto("/project/search/", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    await page.getByRole("checkbox", { name: "サーバーサイドエンジニア" }).check();

    await expect(page.getByRole("checkbox", { name: "サーバーサイドエンジニア" })).toBeChecked();
  });

  test("応募フォーム / 検証: 開始CTA / 期待: 回答開始ボタンを表示", async ({ page }) => {
    await page.goto("/entry/input/1001/short/?hash=ux", { waitUntil: "domcontentloaded" });
    await waitForApp(page);

    const cta = page.getByRole("button", { name: "同意して回答する" });

    await expect(cta).toBeVisible();
  });
});
