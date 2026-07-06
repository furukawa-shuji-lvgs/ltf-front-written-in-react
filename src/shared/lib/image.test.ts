import { describe, expect, it } from "vitest";
import { imageUrl, legacyImageFallbackDataUri } from "./image.ts";

describe("imageUrl", () => {
  it("https から始まる URL はそのまま返すこと", () => {
    expect(imageUrl("https://example.com/logo.svg")).toBe("https://example.com/logo.svg");
  });

  it("移行済み相対パス / 検証: URL解決 / 期待: public images配下を返す", () => {
    const url = imageUrl("/header/icon_code.svg");

    expect(url).toBe("/images/header/icon_code.svg");
  });

  it("未移行相対パス / 検証: URL解決 / 期待: fallback SVG data URI を返すこと", () => {
    const url = imageUrl("/footer/image_page_top.webp");

    expect(url).toBe(legacyImageFallbackDataUri("/footer/image_page_top.webp"));
  });
});
