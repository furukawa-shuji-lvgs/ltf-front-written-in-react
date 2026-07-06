import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: path.join(currentDir, "e2e"),
  testIgnore: path.join(currentDir, "e2e/visual/**"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { outputFolder: path.join(projectRoot, "playwright-report") }]],
  use: {
    baseURL: baseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "pc",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "sp",
      use: { ...devices["iPhone 14"] },
    },
  ],
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
            command: "pnpm dev",
            cwd: projectRoot,
            url: "http://localhost:3000",
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: {
              CUSTOM_ENV: "local",
              GRPC_MOCK_INSECURE: "true",
            },
          },
        ],
      }),
});
