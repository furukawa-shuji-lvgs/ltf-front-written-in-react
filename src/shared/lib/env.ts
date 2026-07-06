import "server-only";

import { z } from "zod";
import envMap from "../../../env/index.ts";
import type { CustomEnv } from "../types/env.ts";
import { getRuntimeEnv } from "./runtimeEnv.ts";

const logLevelSchema = z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]);

const envSchema = z.object({
  BASE_URL: z.string().min(1),
  LTID_BASE_URL: z.string(),
  GRPC_HOST: z.string().min(1),
  OPTIMIZELY_ID: z.string(),
  GOOGLE_TAG_MANAGER_ID: z.string(),
  GOOGLE_TAG_MANAGER_SCRIPT_SRC: z.string(),
  GA_TRACKING_ID: z.string(),
  GOOGLE_OPTIMIZE_ID: z.string(),
  AJO_SCRIPT_SRC: z.string(),
  KIUI_NUXT_MIDDLEWARE_LOG_LEVEL: logLevelSchema,
  KIUI_NUXT_ENDPOINT_LOG_LEVEL: logLevelSchema,
  KIUI_ENV_NAME: z.string().min(1),
  OWND_INFLOW_REDIS_URL: z.string(),
});

export type AppEnv = z.infer<typeof envSchema>;

const isCustomEnv = (value: string): value is CustomEnv =>
  value === "local" || value === "development" || value === "staging" || value === "production";

export const getCustomEnv = (): CustomEnv => {
  const env = getRuntimeEnv("CUSTOM_ENV") ?? "local";
  if (!isCustomEnv(env)) {
    throw new Error(`Invalid CUSTOM_ENV: ${env}`);
  }
  return env;
};

const validatedEnvMap = Object.fromEntries(
  Object.entries(envMap).map(([envName, envValue]) => [envName, envSchema.parse(envValue)]),
) as Record<CustomEnv, AppEnv>;

export const getEnv = (): AppEnv => validatedEnvMap[getCustomEnv()];
