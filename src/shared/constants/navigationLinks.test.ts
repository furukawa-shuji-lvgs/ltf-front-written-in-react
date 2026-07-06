import { describe, expect, it } from "vitest";
import { FooterData } from "./footer.ts";
import { HeaderData } from "./header.ts";
import { LtServices } from "./ltServices.ts";

const collectByKey = (value: unknown, key: string): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectByKey(item, key));
  }
  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
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

describe("Navigation Constants > リンク定義 > 経路", () => {
  it("HeaderData / 検証: path / 期待: 内部絶対パスまたはURLで定義する", () => {
    // Arrange
    const paths = collectByKey(HeaderData, "path");

    // Act
    const invalidPaths = paths.filter((path) => !isAllowedNavigationPath(path));

    // Assert
    expect(invalidPaths).toEqual([]);
  });

  it("FooterData / 検証: path / 期待: 内部絶対パスまたはURLで定義する", () => {
    // Arrange
    const paths = collectByKey(FooterData, "path");

    // Act
    const invalidPaths = paths.filter((path) => !isAllowedNavigationPath(path));

    // Assert
    expect(invalidPaths).toEqual([]);
  });

  it("FooterData / 検証: urlKey / 期待: LtServicesに存在するURLだけを参照する", () => {
    // Arrange
    const urlKeys = collectByKey(FooterData, "urlKey");

    // Act
    const missingUrlKeys = urlKeys.filter(
      (urlKey) => !LtServices[urlKey as keyof typeof LtServices],
    );

    // Assert
    expect(missingUrlKeys).toEqual([]);
  });
});
