import { describe, expect, it } from "vitest";
import { imageUrl } from "./image.ts";

describe("imageUrl", () => {
  it("外部URL / 検証: URL解決 / 期待: そのまま返す", () => {
    // Arrange
    const src = "https://example.com/logo.svg";

    // Act
    const url = imageUrl(src);

    // Assert
    expect(url).toBe("https://example.com/logo.svg");
  });

  it("移行済み相対パス / 検証: URL解決 / 期待: public images配下を返す", () => {
    // Arrange
    const src = "/header/icon_code.svg";

    // Act
    const url = imageUrl(src);

    // Assert
    expect(url).toBe("/images/header/icon_code.svg");
  });

  it("移行済み相対パス / 検証: footer画像URL解決 / 期待: public images配下を返す", () => {
    // Arrange
    const src = "/footer/image_page_top.webp";

    // Act
    const url = imageUrl(src);

    // Assert
    expect(url).toBe("/images/footer/image_page_top.webp");
  });

  it("公開パス指定済みURL / 検証: URL解決 / 期待: 二重にprefixしない", () => {
    // Arrange
    const src = "/images/common/logo_lt.svg";

    // Act
    const url = imageUrl(src);

    // Assert
    expect(url).toBe("/images/common/logo_lt.svg");
  });
});
