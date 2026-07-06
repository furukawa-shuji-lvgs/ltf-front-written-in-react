import { describe, expect, it } from "vitest";
import { encodeLoginInflowCookie, loginInflowSchema } from "./loginInflowInfo.ts";

describe("loginInflowInfo > ログイン流入 > 変換", () => {
  it("有効payload / 検証: schema / 期待: ltf流入だけ許可", () => {
    // Arrange
    const payload = {
      startPage: "/guide/",
      endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
      referer: "https://example.com/ref",
      inflowMedia: "ltf",
    };

    // Act
    const parsed = loginInflowSchema.parse(payload);

    // Assert
    expect(parsed).toStrictEqual(payload);
  });

  it("有効payload / 検証: cookie encode / 期待: base64url文字列を返す", () => {
    // Arrange
    const payload = loginInflowSchema.parse({
      startPage: "/guide/",
      endPage: "https://platform.levtech.jp/login?inflowMedia=ltf",
      referer: "",
      inflowMedia: "ltf",
    });

    // Act
    const value = encodeLoginInflowCookie(payload);

    // Assert
    expect(value).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
