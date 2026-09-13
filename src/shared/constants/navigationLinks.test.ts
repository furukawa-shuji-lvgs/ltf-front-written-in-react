import { describe, expect, it } from "vitest";

import { FooterData } from "./footer.ts";
import { HeaderData } from "./header.ts";
import { LtServices } from "./ltServices.ts";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const collectByKey = (value: unknown, key: string): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectByKey(item, key));
  }
  if (!isRecord(value)) {
    return [];
  }

  const record = value;
  const current = typeof record[key] === "string" ? [record[key]] : [];
  return [
    ...current,
    ...Object.entries(record).flatMap(([childKey, childValue]) =>
      childKey === key ? [] : collectByKey(childValue, key),
    ),
  ];
};

const isAllowedNavigationPath = (value: string): boolean =>
  value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://");

const isMissingServiceUrl = (key: string): boolean => {
  const value = LtServices[key];
  return value === undefined || value === "";
};

describe("navigation Constants > リンク定義 > 経路", () => {
  it("headerData / 検証: path / 期待: 内部絶対パスまたはURLで定義する", () => {
    expect.hasAssertions();
    // Arrange
    const paths = collectByKey(HeaderData, "path");

    // Act
    const invalidPaths = paths.filter((path) => !isAllowedNavigationPath(path));

    // Assert
    expect(invalidPaths).toStrictEqual([]);
  });

  it("footerData / 検証: path / 期待: 内部絶対パスまたはURLで定義する", () => {
    expect.hasAssertions();
    // Arrange
    const paths = collectByKey(FooterData, "path");

    // Act
    const invalidPaths = paths.filter((path) => !isAllowedNavigationPath(path));

    // Assert
    expect(invalidPaths).toStrictEqual([]);
  });

  it("footerData / 検証: urlKey / 期待: LtServicesに存在するURLだけを参照する", () => {
    expect.hasAssertions();
    // Arrange
    const urlKeys = collectByKey(FooterData, "urlKey");

    // Act
    const missingUrlKeys = urlKeys.filter((key) => isMissingServiceUrl(key));

    // Assert
    expect(missingUrlKeys).toStrictEqual([]);
  });
});
