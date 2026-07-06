import { describe, expect, it } from "vitest";
import {
  getGuideDetailBrandRedirect,
  guideDetailBrandRedirectMap,
} from "./guideDetailBrandRedirects.ts";

describe("getGuideDetailBrandRedirect", () => {
  it("リダイレクトマップのエントリ数が移行元と一致すること", () => {
    expect(Object.keys(guideDetailBrandRedirectMap).length).toBe(112);
  });

  it.each([
    ["/guide/detail/942/", "https://levtech.jp/partner/guide/article/detail/34/"],
    ["/guide/detail/1073/", "https://levtech.jp/partner/guide/article/detail/101/"],
    ["/guide/detail/1391/", "https://levtech.jp/partner/guide/article/detail/51/"],
  ])("%s は外部 URL %s へリダイレクトすること", (path, destination) => {
    expect(getGuideDetailBrandRedirect(path)).toBe(destination);
  });

  it("末尾スラッシュなしのパスはリダイレクトしないこと", () => {
    expect(getGuideDetailBrandRedirect("/guide/detail/942")).toBeNull();
  });

  it("対象外のパスはリダイレクトしないこと", () => {
    expect(getGuideDetailBrandRedirect("/guide/detail/1508/")).toBeNull();
  });
});
