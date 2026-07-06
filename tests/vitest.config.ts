import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const coverageThresholds = {
  branches: 80,
  functions: 85,
  lines: 88,
  statements: 88,
};

export default defineConfig({
  root: projectRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "@features": fileURLToPath(new URL("../src/features", import.meta.url)),
      "@shared": fileURLToPath(new URL("../src/shared", import.meta.url)),
      "@generated": fileURLToPath(new URL("../contracts/grpc/generated", import.meta.url)),
      "server-only": fileURLToPath(new URL("./stubs/server-only.ts", import.meta.url)),
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      include: ["src/**"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/*Types.ts",
        "src/**/index.ts",
        "src/**/types.ts",
        "src/app/fonts.ts",
        "src/shared/types/**",
      ],
      thresholds: coverageThresholds,
    },
  },
});
