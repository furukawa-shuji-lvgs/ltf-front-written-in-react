import { describe, expect, it } from "vitest";

import { tdkhMapping } from "./tdkh.ts";

describe(tdkhMapping, () => {
  it.each([
    ["guide", "guide"],
    ["guide-detail-id", "guide_detail"],
    ["guide-ppage", "guide"],
    ["project-search", "project_search"],
    ["service-first-freelance", "first-freelance"],
    ["word", "keyword_top"],
    ["word-list-id-ppage", "keyword_list"],
    ["achievement-interview-list", "interview_top"],
    ["entry-input-chat-id", "proposal"],
  ])("route名 %s は key %s にマッピングされること", (routeName, expected) => {
    expect.hasAssertions();
    expect(tdkhMapping(routeName)).toBe(expected);
  });

  it("マッピングにないroute名は default を返すこと", () => {
    expect.hasAssertions();
    expect(tdkhMapping("unknown-route")).toBe("default");
    expect(tdkhMapping("")).toBe("default");
  });
});
