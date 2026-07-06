import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const readProductionHeaders = (): { key: string; value: string }[] => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      [
        "process.env.NODE_ENV = 'production';",
        "const config = (await import('./next.config.mjs')).default;",
        "console.log(JSON.stringify(await config.headers()));",
      ].join(" "),
    ],
    { encoding: "utf8" },
  );

  return JSON.parse(output)[0].headers;
};

describe("Security Headers > 静的ヘッダー > 設定", () => {
  it("共通ヘッダー / 検証: Referrer-Policy / 期待: strict-origin-when-cross-originを返す", () => {
    // Arrange
    const headers = readProductionHeaders();

    // Act
    const header = headers.find((item) => item.key === "Referrer-Policy");

    // Assert
    expect(header?.value).toBe("strict-origin-when-cross-origin");
  });

  it("共通ヘッダー / 検証: X-Content-Type-Options / 期待: nosniffを返す", () => {
    // Arrange
    const headers = readProductionHeaders();

    // Act
    const header = headers.find((item) => item.key === "X-Content-Type-Options");

    // Assert
    expect(header?.value).toBe("nosniff");
  });

  it("CSP / 検証: next.config / 期待: nonceが必要なCSPを静的headerに置かない", () => {
    // Arrange
    const headers = readProductionHeaders();

    // Act
    const cspHeaders = headers.filter((header) =>
      header.key.toLowerCase().startsWith("content-security-policy"),
    );

    // Assert
    expect(cspHeaders).toHaveLength(0);
  });
});
