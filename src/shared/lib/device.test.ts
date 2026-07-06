import { describe, expect, it } from "vitest";
import { detectDevice } from "./device.ts";

describe("detectDevice", () => {
  it.each([
    [
      "iPhone",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    ],
    [
      "Android スマートフォン",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    ],
  ])("%s の UA は sp と判定する", (_label, ua) => {
    expect(detectDevice(ua)).toBe("sp");
  });

  it.each([
    [
      "Mac Chrome",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ],
    [
      "Android タブレット",
      "Mozilla/5.0 (Linux; Android 14; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ],
  ])("%s の UA は pc と判定する", (_label, ua) => {
    expect(detectDevice(ua)).toBe("pc");
  });

  it("UA が null のときは pc と判定する", () => {
    expect(detectDevice(null)).toBe("pc");
  });
});
