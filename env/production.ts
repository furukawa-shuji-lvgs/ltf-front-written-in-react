import type { LogLevelType } from "../src/shared/types/env.ts";

export default {
  BASE_URL: "freelance.levtech.jp",
  LTID_BASE_URL: "https://auth.levtech.jp",

  GRPC_HOST: "ownd-backend.levtech.org:50051",

  OPTIMIZELY_ID: "25695180580",
  GOOGLE_TAG_MANAGER_ID: "GTM-K8K2XB",
  GOOGLE_TAG_MANAGER_SCRIPT_SRC: "/metrics/",
  GA_TRACKING_ID: "UA-52557798-1",
  GOOGLE_OPTIMIZE_ID: "GTM-MBKC7LJ",
  AJO_SCRIPT_SRC:
    "https://assets.adobedtm.com/780a4200c611/d0ee840fd05e/launch-fdf9a3a3f9dc.min.js",
  KIUI_NUXT_MIDDLEWARE_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_NUXT_ENDPOINT_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_ENV_NAME: "prod",

  OWND_INFLOW_REDIS_URL:
    "redis://ltf-front-cache-rg-v1.sfvaih.clustercfg.apne1.cache.amazonaws.com:6379",

  // TODO: 旧環境のファイルサーバの画像を参照するためだけに使われている. 画像を移行しさえすれば消せる.
  LEGACY_HOST: "https://freelance.levtech.jp",
};
