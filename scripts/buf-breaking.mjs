import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const bufInput = "contracts/grpc";
const defaultAgainst = ".git#branch=main,subdir=contracts/grpc";
const against = process.env.BUF_BREAKING_AGAINST ?? defaultAgainst;

const hasHead =
  spawnSync("git", ["rev-parse", "--verify", "HEAD"], {
    cwd: projectRoot,
    stdio: "ignore",
  }).status === 0;

if (!hasHead && process.env.CI !== "true") {
  process.stderr.write(
    "Skipping buf breaking: no local commits yet. Set BUF_BREAKING_AGAINST to run against an explicit baseline.\n",
  );
  process.exit(0);
}

const result = spawnSync("buf", ["breaking", bufInput, "--against", against], {
  cwd: projectRoot,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
