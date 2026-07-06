import { describe, expect, it } from "vitest";
import { createMapRedirectResolver, createPrefixRedirectResolver } from "./redirectResolver.ts";

describe("Redirect Resolver > データ定義 > 経路", () => {
  it("完全一致マップ / 検証: redirect解決 / 期待: 対応する宛先を返す", () => {
    // Arrange
    const resolveRedirect = createMapRedirectResolver({ "/old/": "/new/" });

    // Act
    const destination = resolveRedirect("/old/");

    // Assert
    expect(destination).toBe("/new/");
  });

  it("完全一致マップ / 検証: 未定義path / 期待: nullを返す", () => {
    // Arrange
    const resolveRedirect = createMapRedirectResolver({ "/old/": "/new/" });

    // Act
    const destination = resolveRedirect("/unknown/");

    // Assert
    expect(destination).toBeNull();
  });

  it("変換付きマップ / 検証: redirect解決 / 期待: 変換後の宛先を返す", () => {
    // Arrange
    const resolveRedirect = createMapRedirectResolver(
      { "/brand/": "/article/" },
      (destination) => `https://example.com${destination}`,
    );

    // Act
    const destination = resolveRedirect("/brand/");

    // Assert
    expect(destination).toBe("https://example.com/article/");
  });

  it("前方一致リスト / 検証: 配下path / 期待: 共通宛先を返す", () => {
    // Arrange
    const resolveRedirect = createPrefixRedirectResolver(["/legacy/search/"], "/search/");

    // Act
    const destination = resolveRedirect("/legacy/search/skill/java/");

    // Assert
    expect(destination).toBe("/search/");
  });
});
