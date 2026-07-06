import { describe, expect, test } from "vitest";
import { CRAWLER_HEADER_NAME, isCrawler } from "./isCrawler.ts";

describe("isCrawler", () => {
  test("x-crawler ヘッダーがある場合に true を返すこと", () => {
    const headers = new Headers({ [CRAWLER_HEADER_NAME]: "1" });
    expect(isCrawler(headers)).toBe(true);
  });

  test("x-crawler ヘッダーがない場合に false を返すこと", () => {
    expect(isCrawler(new Headers())).toBe(false);
  });

  test("headers が渡されない場合に false を返すこと", () => {
    expect(isCrawler()).toBe(false);
    expect(isCrawler(null)).toBe(false);
  });
});
