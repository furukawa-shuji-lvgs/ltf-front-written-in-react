import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const generatedDir = fileURLToPath(new URL("../contracts/grpc/generated", import.meta.url));
const tsNoCheck = "// @ts-nocheck\n";

async function listTsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listTsFiles(fullPath);
      }
      return entry.isFile() && entry.name.endsWith(".ts") ? [fullPath] : [];
    }),
  );

  return files.flat();
}

const files = await listTsFiles(generatedDir);

await Promise.all(
  files.map(async (file) => {
    const content = await readFile(file, "utf8");
    if (content.startsWith(tsNoCheck)) {
      return;
    }
    await writeFile(file, `${tsNoCheck}${content}`);
  }),
);
