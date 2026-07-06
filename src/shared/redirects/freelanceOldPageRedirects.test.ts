import { describe, expect, it } from "vitest";
import {
  freelanceOldPageRedirectMap,
  getFreelanceOldPageRedirect,
} from "./freelanceOldPageRedirects.ts";

describe("getFreelanceOldPageRedirect", () => {
  it("リダイレクトマップのエントリ数が移行元と一致すること（/freelance/ + detail 1〜29 = 30件）", () => {
    expect(Object.keys(freelanceOldPageRedirectMap).length).toBe(30);
  });

  it.each([
    ["/freelance/"],
    ["/freelance/detail/1/"],
    ["/freelance/detail/15/"],
    ["/freelance/detail/29/"],
  ])("%s は /guide/tag/1/ へリダイレクトすること", (path) => {
    expect(getFreelanceOldPageRedirect(path)).toBe("/guide/tag/1/");
  });

  it("detail 30 以降はリダイレクトしないこと", () => {
    expect(getFreelanceOldPageRedirect("/freelance/detail/30/")).toBeNull();
  });

  it("末尾スラッシュなしのパスはリダイレクトしないこと", () => {
    expect(getFreelanceOldPageRedirect("/freelance")).toBeNull();
  });

  it("対象外のパスはリダイレクトしないこと", () => {
    expect(getFreelanceOldPageRedirect("/guide/tag/1/")).toBeNull();
  });
});
