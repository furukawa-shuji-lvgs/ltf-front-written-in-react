import { devices, expect, type Locator, type Page, test } from "@playwright/test";
import { APP_ROOT_SELECTOR, allPageVisualRoutes } from "../../../fixtures/allPages.ts";

const PC_VIEWPORT = { width: 1280, height: 720 };
const SP_VIEWPORT = { width: 375, height: 812 };
const SP_USER_AGENT = devices["iPhone 13"].userAgent;
const STYLE_PATH = "tests/e2e/visual/specs/all-pages/all-pages.visual.css";
const IMAGE_DECODE_TIMEOUT_MS = 2_000;

const VIEWPORTS = [
  {
    label: "PC",
    suffix: "pc",
    viewport: PC_VIEWPORT,
    userAgent: undefined,
  },
  {
    label: "SP",
    suffix: "sp",
    viewport: SP_VIEWPORT,
    userAgent: SP_USER_AGENT,
  },
] as const;

const SCREENSHOT_OPTIONS = {
  animations: "disabled",
  caret: "hide",
  scale: "css",
  stylePath: STYLE_PATH,
  maxDiffPixelRatio: 0.3,
} as const;

const addStableCookies = async (page: Page, baseUrl: string) => {
  const cookieUrl = new URL("/", baseUrl).toString();

  await page.context().addCookies([
    { name: "entryId", value: "12345", url: cookieUrl },
    { name: "projectDetailViewedIds", value: "1001%091002%091003", url: cookieUrl },
    { name: "LTF10119AbTest", value: "LTF10119AbTest-A", url: cookieUrl },
    { name: "LTF9525AbTest", value: "LTF9525AbTest-A", url: cookieUrl },
  ]);
  await page.addInitScript(() => {
    window.sessionStorage.setItem("projectDetailViewedIds", "1001\t1002\t1003");
  });
};

const waitForImagesReady = async (target: Locator) => {
  await target.evaluate(async (element, timeoutMs) => {
    const timeout = new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    });
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
      images.map(async (image) => {
        if (image.complete) return;
        await Promise.race([image.decode().catch(() => undefined), timeout]);
      }),
    );
  }, IMAGE_DECODE_TIMEOUT_MS);
};

const waitForHeightStable = async (page: Page) => {
  await page.waitForFunction(async (selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;

    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    let previousHeight = element.getBoundingClientRect().height;

    for (let index = 0; index < 5; index += 1) {
      await nextFrame();
      const currentHeight = element.getBoundingClientRect().height;
      if (currentHeight !== previousHeight) return false;
      previousHeight = currentHeight;
    }

    return true;
  }, APP_ROOT_SELECTOR);
};

const waitForPageReady = async (page: Page) => {
  const app = page.locator(APP_ROOT_SELECTOR);

  await expect(app).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await waitForImagesReady(app);
  await waitForHeightStable(page);
};

for (const { label, suffix, viewport, userAgent } of VIEWPORTS) {
  test.describe(`all ltf-react pages ${label} visual`, () => {
    test.use(userAgent ? { viewport, userAgent } : { viewport });

    for (const route of allPageVisualRoutes) {
      test(`${route.slug}`, async ({ page, baseURL }) => {
        await addStableCookies(page, baseURL ?? "http://127.0.0.1:3001");
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await waitForPageReady(page);

        await expect(page.locator(APP_ROOT_SELECTOR)).toHaveScreenshot(
          `${route.slug}-${suffix}.png`,
          SCREENSHOT_OPTIONS,
        );
      });
    }
  });
}
