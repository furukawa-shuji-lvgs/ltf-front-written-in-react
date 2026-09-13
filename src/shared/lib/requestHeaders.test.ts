import { describe, expect, it } from "vitest";

import { firstHeaderValue, requestIpKeyFor } from "./requestHeaders.ts";

describe(firstHeaderValue, () => {
  it.each([
    { description: "欠落", value: null, expected: undefined },
    { description: "空文字", value: "", expected: undefined },
    { description: "空白のみ", value: "   ", expected: undefined },
    { description: "先頭が空", value: " , 203.0.113.1", expected: undefined },
    { description: "単一の値", value: "203.0.113.1", expected: "203.0.113.1" },
    { description: "複数の値", value: " 203.0.113.1 , 203.0.113.2", expected: "203.0.113.1" },
  ])(
    "$description / 検証: ヘッダーの先頭値 / 期待: 空白を除去して空値を欠落として扱う",
    ({ value, expected }) => {
      expect.hasAssertions();
      expect(firstHeaderValue(value)).toBe(expected);
    },
  );
});

describe(requestIpKeyFor, () => {
  it("空の転送元 / 検証: IP の代替値 / 期待: x-real-ip を使う", () => {
    expect.hasAssertions();
    const headers = new Headers({ "x-forwarded-for": " ", "x-real-ip": "203.0.113.2" });
    expect(requestIpKeyFor(headers)).toBe("203.0.113.2");
  });
});
