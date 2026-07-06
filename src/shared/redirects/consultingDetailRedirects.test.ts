import { describe, expect, it } from "vitest";
import {
  consultingDetailRedirectMap,
  getConsultingDetailRedirect,
} from "./consultingDetailRedirects.ts";

describe("getConsultingDetailRedirect", () => {
  it("リダイレクトマップのエントリ数が移行元と一致すること", () => {
    expect(Object.keys(consultingDetailRedirectMap).length).toBe(322);
  });

  it.each([
    ["/consulting/detail/1/", "/guide/detail/491/"],
    ["/consulting/detail/155/", "/guide/detail/605/"],
    ["/consulting/detail/358/", "/guide/detail/812/"],
  ])("%s は %s へリダイレクトすること", (path, destination) => {
    expect(getConsultingDetailRedirect(path)).toBe(destination);
  });

  it("マップに存在しない番号（欠番）はリダイレクトしないこと", () => {
    expect(getConsultingDetailRedirect("/consulting/detail/44/")).toBeNull();
  });

  it("末尾スラッシュなしのパスはリダイレクトしないこと", () => {
    expect(getConsultingDetailRedirect("/consulting/detail/1")).toBeNull();
  });

  it("対象外のパスはリダイレクトしないこと", () => {
    expect(getConsultingDetailRedirect("/guide/detail/1/")).toBeNull();
  });
});
