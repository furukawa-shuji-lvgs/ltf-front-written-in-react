import { beforeEach, describe, expect, vi, it } from "vitest";

import type { getEnv, getCustomEnv } from "./env.ts";

import localEnv from "../../../env/local.ts";
import { createPageMetadata } from "./pageMeta.ts";

const { getEnvMock, getCustomEnvMock } = vi.hoisted(() => ({
  getEnvMock: vi.fn<typeof getEnv>(),
  getCustomEnvMock: vi.fn<typeof getCustomEnv>(),
}));

vi.mock(import("@shared/lib/env"), () => ({
  getEnv: getEnvMock,
  getCustomEnv: getCustomEnvMock,
}));

const tdkh = {
  key: "guide",
  title: "お役立ち記事 | レバテックフリーランス",
  description: "説明文",
  keywords: "フリーランス,記事",
  h1: "お役立ち記事",
};

describe(createPageMetadata, () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEnvMock.mockReturnValue({ ...localEnv, BASE_URL: "freelance.levtech.jp" });
    getCustomEnvMock.mockReturnValue("production");
  });

  it("tDKH の値が title/description/keywords に設定されること", () => {
    expect.hasAssertions();
    const metadata = createPageMetadata(tdkh, "/guide/");

    expect(metadata.title).toBe("お役立ち記事 | レバテックフリーランス");
    expect(metadata.description).toBe("説明文");
    expect(metadata.keywords).toBe("フリーランス,記事");
  });

  it("og:title / og:description / og:url が設定されること", () => {
    expect.hasAssertions();
    const metadata = createPageMetadata(tdkh, "/guide/");

    expect(metadata.openGraph).toMatchObject({
      title: "お役立ち記事 | レバテックフリーランス",
      description: "説明文",
      url: "https://freelance.levtech.jp/guide/",
    });
  });

  it("og:type はデフォルトで article になること", () => {
    expect.hasAssertions();
    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.openGraph).toMatchObject({ type: "article" });
  });

  it("og:type を website に指定できること", () => {
    expect.hasAssertions();
    const metadata = createPageMetadata(tdkh, "/", { ogType: "website" });
    expect(metadata.openGraph).toMatchObject({ type: "website" });
  });

  it("canonical が BASE_URL とパスから組み立てられること", () => {
    expect.hasAssertions();
    const metadata = createPageMetadata(tdkh, "/guide/detail/1/");
    expect(metadata.alternates?.canonical).toBe("https://freelance.levtech.jp/guide/detail/1/");
  });

  it("staging では https の URL になること", () => {
    expect.hasAssertions();
    getEnvMock.mockReturnValue({ ...localEnv, BASE_URL: "freelance.stg.levtech.org" });
    getCustomEnvMock.mockReturnValue("staging");

    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.alternates?.canonical).toBe("https://freelance.stg.levtech.org/guide/");
  });

  it("local / development では http の URL になること", () => {
    expect.hasAssertions();
    getEnvMock.mockReturnValue({ ...localEnv, BASE_URL: "localhost:3000" });
    getCustomEnvMock.mockReturnValue("local");

    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/guide/");
  });

  it("空の TDKH（フォールバック DTO）でもエラーにならないこと", () => {
    expect.hasAssertions();
    const emptyTdkh = { key: "", title: "", description: "", keywords: "", h1: "" };
    const metadata = createPageMetadata(emptyTdkh, "/guide/");

    expect(metadata.title).toBe("");
    expect(metadata.description).toBe("");
    expect(metadata.alternates?.canonical).toBe("https://freelance.levtech.jp/guide/");
  });
});
