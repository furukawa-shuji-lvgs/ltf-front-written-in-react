import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../../..");
const frontRoot = process.env.LTF_FRONT_ROOT
  ? path.resolve(process.env.LTF_FRONT_ROOT)
  : path.resolve(projectRoot, "..", "ltf-front");
const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3001";

export default defineConfig({
  testDir: path.join(currentDir, "specs"),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: path.join(projectRoot, "playwright-report/visual") }],
  ],
  snapshotPathTemplate: path.join(
    frontRoot,
    "tests/e2e/visual/specs/all-pages/all-pages.visual.spec.ts-snapshots/{arg}{ext}",
  ),
  use: {
    baseURL: baseUrl,
    trace: "retain-on-failure",
  },
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: [
          {
            command: "pnpm grpc:mock",
            cwd: projectRoot,
            port: 60051,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
          {
            command: "pnpm dev -H 127.0.0.1 -p 3001",
            cwd: projectRoot,
            url: baseUrl,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: {
              CUSTOM_ENV: "local",
              GRPC_MOCK_INSECURE: "true",
              E2E_LEGACY_VISUAL: "true",
            },
          },
        ],
      }),
});
