import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const scanDirs = ["src", "tests"].map((dir) => path.join(root, dir));
const extensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const generatedRelativePattern =
  /(?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s+)?["'](?:\.\.\/)+contracts\/grpc\/generated\/[^"']+["']/g;

const collectFiles = (dir) => {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === "node_modules") continue;
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (extensions.has(path.extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
};

const toPosix = (value) => value.split(path.sep).join("/");
const lineNumberAt = (source, index) => source.slice(0, index).split("\n").length;
const violations = [];

for (const dir of scanDirs) {
  for (const filePath of collectFiles(dir)) {
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(generatedRelativePattern)) {
      violations.push(
        `${toPosix(path.relative(root, filePath))}:${lineNumberAt(
          source,
          match.index ?? 0,
        )} use @generated alias instead of relative generated import`,
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(`Generated import check failed:\n${violations.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Generated import check passed.\n");
