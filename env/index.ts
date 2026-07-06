import type { CustomEnv } from "../src/shared/types/env.ts";
import development from "./development.ts";
import local from "./local.ts";
import production from "./production.ts";
import staging from "./staging.ts";

export default {
  local,
  development,
  production,
  staging,
} satisfies Record<CustomEnv, object>;
