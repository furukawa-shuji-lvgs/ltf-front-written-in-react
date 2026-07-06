import { describe, expect, it } from "vitest";
import { getOldProjectSearchRedirect } from "./oldProjectSearchRedirects.ts";

describe("getOldProjectSearchRedirect", () => {
  it.each([
    ["/project/pre_search/"],
    ["/project/easy_search/"],
  ])("%s は /project/search/ へリダイレクトすること", (path) => {
    expect(getOldProjectSearchRedirect(path)).toBe("/project/search/");
  });

  it("前方一致のため配下のパスもリダイレクトすること", () => {
    expect(getOldProjectSearchRedirect("/project/pre_search/foo/")).toBe("/project/search/");
    expect(getOldProjectSearchRedirect("/project/easy_search/p2/")).toBe("/project/search/");
  });

  it("末尾スラッシュなしのパスはリダイレクトしないこと", () => {
    expect(getOldProjectSearchRedirect("/project/pre_search")).toBeNull();
  });

  it("対象外のパスはリダイレクトしないこと", () => {
    expect(getOldProjectSearchRedirect("/project/search/")).toBeNull();
  });
});
