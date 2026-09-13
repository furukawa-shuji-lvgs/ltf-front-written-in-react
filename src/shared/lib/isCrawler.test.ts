import { describe, expect, it } from "vitest";

import { CRAWLER_HEADER_NAME, isCrawler } from "./isCrawler.ts";

describe(isCrawler, () => {
  it("x-crawler ヘッダーがある場合に true を返すこと", () => {
    expect.hasAssertions();
    const headers = new Headers({ [CRAWLER_HEADER_NAME]: "1" });
    expect(isCrawler(headers)).toBe(true);
  });

  it("x-crawler ヘッダーがない場合に false を返すこと", () => {
    expect.hasAssertions();
    expect(isCrawler(new Headers())).toBe(false);
  });

  it("headers が渡されない場合に false を返すこと", () => {
    expect.hasAssertions();
    expect(isCrawler()).toBe(false);
    expect(isCrawler(null)).toBe(false);
  });
});
