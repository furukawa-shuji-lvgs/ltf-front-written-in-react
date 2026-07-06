import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const srcDir = path.join(root, "src");
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const allowedFeatureDependency = new Set(["routeCatalog"]);
const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

const toPosix = (value) => value.split(path.sep).join("/");

const collectSourceFiles = (dir) => {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === "generated" || entry === "node_modules") continue;
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (sourceExtensions.has(path.extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
};

const lineNumberAt = (source, index) => source.slice(0, index).split("\n").length;

const normalizeImportTarget = (filePath, specifier) => {
  if (specifier.startsWith("@features/")) {
    return `src/features/${specifier.slice("@features/".length)}`;
  }
  if (specifier.startsWith("@shared/")) {
    return `src/shared/${specifier.slice("@shared/".length)}`;
  }
  if (specifier.startsWith("@/")) {
    return `src/${specifier.slice("@/".length)}`;
  }
  if (specifier.startsWith(".")) {
    return toPosix(path.relative(root, path.resolve(path.dirname(filePath), specifier)));
  }
  return null;
};

const featureNameFor = (relativePath) => {
  const match = relativePath.match(/^src\/features\/([^/]+)\//);
  return match?.[1] ?? null;
};

const isLegacyVrtBridgeImporter = (relativePath) =>
  /^src\/features\/[^/]+\/components\/[^/]+(?:Page|LegacyBody)\.tsx$/.test(relativePath);

const isFeatureLayer = (relativePath) => relativePath.startsWith("src/features/");
const isSharedLayer = (relativePath) => relativePath.startsWith("src/shared/");
const isAppLayer = (relativePath) => relativePath.startsWith("src/app/");

const isServerOnlyModule = (relativePath) =>
  /^src\/shared\/api\//.test(relativePath) ||
  /^src\/shared\/lib\/grpc\//.test(relativePath) ||
  relativePath === "src/shared/lib/env.ts" ||
  relativePath === "src/shared/lib/image.ts";

const isClientModule = (source) => /^\s*["']use client["'];/.test(source);

const violations = [];

for (const filePath of collectSourceFiles(srcDir)) {
  const source = readFileSync(filePath, "utf8");
  const relativePath = toPosix(path.relative(root, filePath));
  const importerFeature = featureNameFor(relativePath);

  if (
    isServerOnlyModule(relativePath) &&
    !relativePath.endsWith(".test.ts") &&
    !relativePath.endsWith(".test.tsx") &&
    !relativePath.endsWith("/types.ts") &&
    !source.includes('import "server-only";')
  ) {
    violations.push(`${relativePath}:1 server-only import is required`);
  }

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2];
    if (!specifier) continue;

    const target = normalizeImportTarget(filePath, specifier);
    if (!target) continue;

    const line = lineNumberAt(source, match.index ?? 0);

    if (isSharedLayer(relativePath) && target.startsWith("src/features/")) {
      violations.push(
        `${relativePath}:${line} shared modules must not import feature modules (${specifier})`,
      );
    }

    if ((isFeatureLayer(relativePath) || isSharedLayer(relativePath)) && isAppLayer(target)) {
      violations.push(
        `${relativePath}:${line} feature/shared modules must not import app layer modules (${specifier})`,
      );
    }

    const targetFeature = featureNameFor(target);
    if (
      importerFeature &&
      targetFeature &&
      importerFeature !== targetFeature &&
      targetFeature !== "legacyVrt" &&
      !allowedFeatureDependency.has(targetFeature)
    ) {
      violations.push(
        `${relativePath}:${line} feature "${importerFeature}" must not import feature "${targetFeature}" (${specifier})`,
      );
    }

    if (
      importerFeature &&
      importerFeature !== "legacyVrt" &&
      targetFeature === "legacyVrt" &&
      !isLegacyVrtBridgeImporter(relativePath)
    ) {
      violations.push(
        `${relativePath}:${line} legacyVrt imports are limited to migration Page/LegacyBody bridge modules (${specifier})`,
      );
    }

    if (
      isClientModule(source) &&
      (target.startsWith("src/shared/api/") ||
        target.startsWith("src/shared/lib/grpc/") ||
        target === "src/shared/lib/env" ||
        target === "src/shared/lib/env.ts" ||
        target === "src/shared/lib/image" ||
        target === "src/shared/lib/image.ts")
    ) {
      violations.push(
        `${relativePath}:${line} client modules must not import server-only modules (${specifier})`,
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write("Boundary check failed:\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("Boundary check passed.\n");
