import { describe, expect, it } from "vitest";
import { getGuideDetailRedirect, guideDetailRedirectMap } from "./guideDetailRedirects.ts";

describe("getGuideDetailRedirect", () => {
  it("リダイレクトマップのエントリ数が移行元と一致すること", () => {
    expect(Object.keys(guideDetailRedirectMap).length).toBe(139);
  });

  it.each([
    ["/guide/detail/1/", "/guide/detail/1508/"],
    ["/guide/detail/915/", "/project/marketprice/"],
    ["/guide/detail/1506/", "/guide/detail/921/"],
  ])("%s は %s へリダイレクトすること", (path, destination) => {
    expect(getGuideDetailRedirect(path)).toBe(destination);
  });

  it.each([
    ["/guide/detail/1/p2/", "/guide/detail/1508#2"],
    ["/guide/detail/1/p3/", "/guide/detail/1508#3"],
  ])("ページ分割されていた %s はハッシュ付きの %s へリダイレクトすること", (path, destination) => {
    expect(getGuideDetailRedirect(path)).toBe(destination);
  });

  it("末尾スラッシュなしのパスはリダイレクトしないこと", () => {
    expect(getGuideDetailRedirect("/guide/detail/1")).toBeNull();
  });

  it("対象外のパスはリダイレクトしないこと", () => {
    expect(getGuideDetailRedirect("/guide/detail/1508/")).toBeNull();
  });
});
