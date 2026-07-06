import { describe, expect, test } from "vitest";
import {
  META_ROBOTS_INDEX_FOLLOW,
  META_ROBOTS_NOINDEX_NOFOLLOW,
  metaRobotsMapping,
} from "./metaRobots.ts";

describe("metaRobotsMapping", () => {
  test("lp で始まるパスは noindex,nofollow を返すこと", () => {
    expect(metaRobotsMapping("lp")).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
    expect(metaRobotsMapping("lp-foo")).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
  });

  test.each([
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
    expect(metaRobotsMapping(path)).toBe(META_ROBOTS_NOINDEX_NOFOLLOW);
  });

  test("マッピングにないパスは index,follow を返すこと", () => {
    expect(metaRobotsMapping("guide")).toBe(META_ROBOTS_INDEX_FOLLOW);
    expect(metaRobotsMapping("")).toBe(META_ROBOTS_INDEX_FOLLOW);
  });
});
