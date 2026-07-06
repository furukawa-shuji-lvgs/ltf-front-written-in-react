import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../../..");
const srcDir = path.join(projectRoot, "src");
const publicImagesDir = path.join(projectRoot, "public/images");
const sourceExtensions = new Set([".ts", ".tsx"]);
const localAssetPathPattern =
  /["'`](\/(?:certification|common|header|footer|top|guide|project|service|achievement|consultation|entryForm|friend|friendCp|help|women|word)[^"'`]+\.(?:svg|png|webp|ico))["'`]/g;
const publicImagePathPattern = /["'`](\/images\/[^"'`]+\.(?:svg|png|webp|ico))["'`]/g;

const collectSourceFiles = (dir: string): string[] => {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === "generated") continue;
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (sourceExtensions.has(path.extname(entry)) && !entry.includes(".test.")) {
      files.push(fullPath);
    }
  }

  return files;
};

const collectLocalAssetPaths = (sourceFiles: string[]): string[] => {
  const assetPaths = new Set<string>();

  for (const filePath of sourceFiles) {
    const source = readFileSync(filePath, "utf8");
    for (const pattern of [localAssetPathPattern, publicImagePathPattern]) {
      for (const match of source.matchAll(pattern)) {
        const assetPath = match[1];
        if (assetPath) {
          assetPaths.add(assetPath.replace(/^\/images\//, "/"));
        }
      }
    }
  }

  return [...assetPaths].sort();
};

describe("ローカルアセット > public images > 経路", () => {
  it("ltf-react管理画像 / 検証: 実ファイル / 期待: 参照先が全てpublic/imagesに存在する", () => {
    // Arrange
    const sourceFiles = collectSourceFiles(srcDir);

    // Act
    const missingAssetPaths = collectLocalAssetPaths(sourceFiles).filter(
      (assetPath) => !existsSync(path.join(publicImagesDir, assetPath)),
    );

    // Assert
    expect(missingAssetPaths, "public/imagesに存在しないltf-react管理画像があります").toStrictEqual(
      [],
    );
  });
});
