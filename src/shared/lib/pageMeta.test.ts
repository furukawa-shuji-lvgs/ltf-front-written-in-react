import { beforeEach, describe, expect, test, vi } from "vitest";

const { getEnvMock, getCustomEnvMock } = vi.hoisted(() => ({
  getEnvMock: vi.fn(),
  getCustomEnvMock: vi.fn(),
}));

vi.mock("@shared/lib/env", () => ({
  getEnv: getEnvMock,
  getCustomEnv: getCustomEnvMock,
}));

import { createPageMetadata } from "./pageMeta.ts";

const tdkh = {
  key: "guide",
  title: "お役立ち記事 | レバテックフリーランス",
  description: "説明文",
  keywords: "フリーランス,記事",
  h1: "お役立ち記事",
};

describe("createPageMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEnvMock.mockReturnValue({ BASE_URL: "freelance.levtech.jp" });
    getCustomEnvMock.mockReturnValue("production");
  });

  test("TDKH の値が title/description/keywords に設定されること", () => {
    const metadata = createPageMetadata(tdkh, "/guide/");

    expect(metadata.title).toBe("お役立ち記事 | レバテックフリーランス");
    expect(metadata.description).toBe("説明文");
    expect(metadata.keywords).toBe("フリーランス,記事");
  });

  test("og:title / og:description / og:url が設定されること", () => {
    const metadata = createPageMetadata(tdkh, "/guide/");

    expect(metadata.openGraph).toMatchObject({
      title: "お役立ち記事 | レバテックフリーランス",
      description: "説明文",
      url: "https://freelance.levtech.jp/guide/",
    });
  });

  test("og:type はデフォルトで article になること", () => {
    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.openGraph).toMatchObject({ type: "article" });
  });

  test("og:type を website に指定できること", () => {
    const metadata = createPageMetadata(tdkh, "/", { ogType: "website" });
    expect(metadata.openGraph).toMatchObject({ type: "website" });
  });

  test("canonical が BASE_URL とパスから組み立てられること", () => {
    const metadata = createPageMetadata(tdkh, "/guide/detail/1/");
    expect(metadata.alternates?.canonical).toBe("https://freelance.levtech.jp/guide/detail/1/");
  });

  test("staging では https の URL になること", () => {
    getEnvMock.mockReturnValue({ BASE_URL: "freelance.stg.levtech.org" });
    getCustomEnvMock.mockReturnValue("staging");

    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.alternates?.canonical).toBe("https://freelance.stg.levtech.org/guide/");
  });

  test("local / development では http の URL になること", () => {
    getEnvMock.mockReturnValue({ BASE_URL: "localhost:3000" });
    getCustomEnvMock.mockReturnValue("local");

    const metadata = createPageMetadata(tdkh, "/guide/");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/guide/");
  });

  test("空の TDKH（フォールバック DTO）でもエラーにならないこと", () => {
    const emptyTdkh = { key: "", title: "", description: "", keywords: "", h1: "" };
    const metadata = createPageMetadata(emptyTdkh, "/guide/");

    expect(metadata.title).toBe("");
    expect(metadata.description).toBe("");
    expect(metadata.alternates?.canonical).toBe("https://freelance.levtech.jp/guide/");
  });
});
