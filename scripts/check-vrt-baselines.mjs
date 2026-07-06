import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const fixturePath = path.join(projectRoot, "tests/e2e/fixtures/allPages.ts");
const ltfFrontRoot = process.env.LTF_FRONT_ROOT
  ? path.resolve(process.env.LTF_FRONT_ROOT)
  : path.resolve(projectRoot, "..", "ltf-front");
const snapshotDir = path.join(
  ltfFrontRoot,
  "tests/e2e/visual/specs/all-pages/all-pages.visual.spec.ts-snapshots",
);
const suffixes = ["pc", "sp"];

const fixtureSource = readFileSync(fixturePath, "utf8");
const slugs = Array.from(fixtureSource.matchAll(/slug:\s*"([^"]+)"/g), (match) => match[1]).filter(
  Boolean,
);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
const missingSnapshots = slugs.flatMap((slug) =>
  suffixes
    .map((suffix) => `${slug}-${suffix}.png`)
    .filter((filename) => !existsSync(path.join(snapshotDir, filename))),
);

if (!existsSync(snapshotDir)) {
  process.stderr.write(`VRT baseline snapshot directory is missing: ${snapshotDir}\n`);
  process.exit(1);
}

if (duplicateSlugs.length > 0) {
  process.stderr.write(
    `VRT route fixture contains duplicate slugs:\n${duplicateSlugs.join("\n")}\n`,
  );
  process.exit(1);
}

if (missingSnapshots.length > 0) {
  process.stderr.write(
    `VRT baseline snapshots are missing:\n${missingSnapshots
      .map((filename) => path.join(snapshotDir, filename))
      .join("\n")}\n`,
  );
  process.exit(1);
}

process.stdout.write(`VRT baseline snapshots are complete: ${slugs.length * suffixes.length}\n`);
