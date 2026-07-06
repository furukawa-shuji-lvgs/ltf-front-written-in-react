import { describe, expect, test } from "vitest";
import { formatDate } from "./date.ts";

describe("formatDate", () => {
  test("yyyy-MM-dd HH:mm:ss 形式に整形できること", () => {
    const date = new Date(2026, 6, 3, 9, 5, 7);
    expect(formatDate(date, "yyyy-MM-dd HH:mm:ss")).toBe("2026-07-03 09:05:07");
  });

  test("月・日・時・分・秒が1桁の場合に0埋めされること", () => {
    const date = new Date(2026, 0, 2, 3, 4, 5);
    expect(formatDate(date, "yyyy/MM/dd HH:mm:ss")).toBe("2026/01/02 03:04:05");
  });

  test("ミリ秒（SSS）が3桁で0埋めされること", () => {
    const date = new Date(2026, 6, 3, 0, 0, 0, 7);
    expect(formatDate(date, "ss.SSS")).toBe("00.007");
  });

  test("曜日（E）が日本語で出力されること", () => {
    // 2026-07-03 は金曜日
    const date = new Date(2026, 6, 3);
    expect(formatDate(date, "yyyy-MM-dd (E)")).toBe("2026-07-03 (金)");
  });

  test("フォーマット指定子を含まない文字列はそのまま返すこと", () => {
    const date = new Date(2026, 6, 3);
    expect(formatDate(date, "こんにちは")).toBe("こんにちは");
  });

  test("同じ指定子が複数含まれる場合にすべて置換されること", () => {
    const date = new Date(2026, 6, 3);
    expect(formatDate(date, "MM月MM月")).toBe("07月07月");
  });
});
