import type { LogLevelType } from "../src/shared/types/env.ts";

export default {
  BASE_URL: "freelance.stg.levtech.org",
  LTID_BASE_URL: "https://auth.stg-new.levtech.org",

  GRPC_HOST: "stg-ownd-backend.levtech.org:50051",

  OPTIMIZELY_ID: "26581190017",
  GOOGLE_TAG_MANAGER_ID: "GTM-TRH53Q",
  GOOGLE_TAG_MANAGER_SCRIPT_SRC: "/metrics/",
  GA_TRACKING_ID: "UA-52557798-4",
  GOOGLE_OPTIMIZE_ID: "GTM-5WLRLQR",
  AJO_SCRIPT_SRC:
    "https://assets.adobedtm.com/780a4200c611/d0ee840fd05e/launch-97d072db611f-staging.min.js",
  KIUI_NUXT_MIDDLEWARE_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_NUXT_ENDPOINT_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_ENV_NAME: "stg",

  OWND_INFLOW_REDIS_URL:
    "redis://ltf-front-cache-rg-v1.vsemz5.clustercfg.apne1.cache.amazonaws.com:6379",

  // TODO: 旧環境のファイルサーバの画像を参照するためだけに使われている. 画像を移行しさえすれば消せる.
  LEGACY_HOST: "https://freelance.stg.levtech.org",
};
