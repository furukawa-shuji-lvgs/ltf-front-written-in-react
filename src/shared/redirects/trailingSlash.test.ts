import { describe, expect, it } from "vitest";
import { getTrailingSlashRedirect } from "./trailingSlash.ts";

describe("getTrailingSlashRedirect", () => {
  it("末尾スラッシュなしのパスにはスラッシュを付与してリダイレクトすること", () => {
    expect(getTrailingSlashRedirect("/guide")).toBe("/guide/");
    expect(getTrailingSlashRedirect("/guide/detail/1")).toBe("/guide/detail/1/");
  });

  it("末尾スラッシュ付きのパスはリダイレクトしないこと", () => {
    expect(getTrailingSlashRedirect("/guide/")).toBeNull();
    expect(getTrailingSlashRedirect("/")).toBeNull();
  });

  it("クエリパラメータを維持してリダイレクトすること", () => {
    expect(
      getTrailingSlashRedirect("/project/search", new URLSearchParams("page=2&sort=new")),
    ).toBe("/project/search/?page=2&sort=new");
  });

  it("クエリパラメータが空のときは付与しないこと", () => {
    expect(getTrailingSlashRedirect("/guide", new URLSearchParams())).toBe("/guide/");
  });

  it("拡張子付きのパスにもスラッシュを付与すること（移行元と同じ挙動。middleware の matcher で除外される）", () => {
    expect(getTrailingSlashRedirect("/images/logo.png")).toBe("/images/logo.png/");
  });

  it("api を含むパスはリダイレクトしないこと", () => {
    expect(getTrailingSlashRedirect("/api/foo")).toBeNull();
    expect(getTrailingSlashRedirect("/API/foo")).toBeNull();
  });

  it("移行元と同じく api を部分文字列として含むパスもリダイレクトしないこと", () => {
    expect(getTrailingSlashRedirect("/rapid")).toBeNull();
  });
});
