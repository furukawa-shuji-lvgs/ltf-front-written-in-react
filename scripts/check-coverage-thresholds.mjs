import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const coverageSummaryPath = path.join(process.cwd(), "coverage", "coverage-summary.json");

const directoryThresholds = [
  {
    directory: "src/app/api/",
    thresholds: { branches: 65, functions: 80, lines: 85, statements: 85 },
  },
  {
    directory: "src/features/guide/api/",
    thresholds: { branches: 70, functions: 95, lines: 90, statements: 90 },
  },
  {
    directory: "src/features/inflow/api/",
    thresholds: { branches: 70, functions: 90, lines: 90, statements: 90 },
  },
  {
    directory: "src/features/project/api/",
    thresholds: { branches: 75, functions: 90, lines: 90, statements: 90 },
  },
  {
    directory: "src/features/routeCatalog/",
    thresholds: { branches: 85, functions: 90, lines: 95, statements: 95 },
  },
  {
    directory: "src/shared/api/seo/",
    thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
  {
    directory: "src/shared/components/HeaderPc/",
    thresholds: { branches: 75, functions: 60, lines: 90, statements: 90 },
  },
  {
    directory: "src/shared/components/HeaderSp/",
    thresholds: { branches: 85, functions: 85, lines: 90, statements: 90 },
  },
  {
    directory: "src/shared/components/Pagination/",
    thresholds: { branches: 90, functions: 95, lines: 95, statements: 95 },
  },
  {
    directory: "src/shared/lib/",
    thresholds: { branches: 80, functions: 80, lines: 90, statements: 90 },
  },
  {
    directory: "src/shared/redirects/",
    thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
];

if (!existsSync(coverageSummaryPath)) {
  process.stderr.write(`Coverage summary is missing: ${coverageSummaryPath}\n`);
  process.exit(1);
}

const coverageSummary = JSON.parse(readFileSync(coverageSummaryPath, "utf8"));

const normalizePath = (value) => {
  const normalized = value.split(path.sep).join("/");
  const srcIndex = normalized.indexOf("src/");
  return srcIndex >= 0 ? normalized.slice(srcIndex) : normalized;
};

const coveredMetric = (entry, metric) => ({
  covered: entry[metric].covered,
  total: entry[metric].total,
});

const ratio = ({ covered, total }) => (total === 0 ? 100 : (covered / total) * 100);

const aggregateDirectory = (directory) => {
  const entries = Object.entries(coverageSummary).filter(
    ([filePath]) => filePath !== "total" && normalizePath(filePath).startsWith(directory),
  );

  if (entries.length === 0) {
    throw new Error(`Coverage directory has no files: ${directory}`);
  }

  const initial = {
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
    statements: { covered: 0, total: 0 },
  };

  return entries.reduce((accumulator, [, entry]) => {
    for (const metric of Object.keys(initial)) {
      const current = coveredMetric(entry, metric);
      accumulator[metric].covered += current.covered;
      accumulator[metric].total += current.total;
    }
    return accumulator;
  }, initial);
};

const violations = [];

for (const { directory, thresholds } of directoryThresholds) {
  const aggregate = aggregateDirectory(directory);

  for (const [metric, threshold] of Object.entries(thresholds)) {
    const actual = ratio(aggregate[metric]);
    if (actual < threshold) {
      violations.push(`${directory} ${metric}: ${actual.toFixed(2)} < ${threshold}`);
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(`Directory coverage thresholds failed:\n${violations.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Directory coverage thresholds passed.\n");
