import { describe, expect, it } from "vitest";

import {
  META_ROBOTS_INDEX_FOLLOW,
  META_ROBOTS_NOINDEX_NOFOLLOW,
  metaRobotsMapping,
} from "./metaRobots.ts";

describe(metaRobotsMapping, () => {
  it("lp で始まるパスは noindex,nofollow を返すこと", () => {
    expect.hasAssertions();
    expect(metaRobotsMapping("lp")).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
    expect(metaRobotsMapping("lp-foo")).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
  });

  it.each([
    "entry-complete",
    "entry-input-chat-id",
    "entry-input-id-short",
    "entry-short-complete",
    "friend-cp",
    "friend-cp-complete",
    "maintenance",
    "member-input-short",
    "member-complete",
    "member-short-complete",
    "project-undecided",
  ])("%s は noindex,nofollow を返すこと", (path) => {
    expect.hasAssertions();
    expect(metaRobotsMapping(path)).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
  });

  it("マッピングにないパスは index,follow を返すこと", () => {
    expect.hasAssertions();
    expect(metaRobotsMapping("guide")).toBe(META_ROBOTS_INDEX_FOLLOW);
    expect(metaRobotsMapping("")).toBe(META_ROBOTS_INDEX_FOLLOW);
  });
});
