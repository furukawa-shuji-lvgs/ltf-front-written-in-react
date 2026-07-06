import type { LogLevelType } from "../src/shared/types/env.ts";

export default {
  BASE_URL: "localhost:3000",
  LTID_BASE_URL: "",

  GRPC_HOST: "127.0.0.1:60051",

  OPTIMIZELY_ID: "26581190017",
  GOOGLE_TAG_MANAGER_ID: "GTM-TRH53Q",
  // CloudFrontのsGTMパスがSTGとPRD以外には存在しないため、GTMのURLを直接指定する
  GOOGLE_TAG_MANAGER_SCRIPT_SRC: "https://www.googletagmanager.com/gtm.js",
  GA_TRACKING_ID: "UA-52557798-4",
  GOOGLE_OPTIMIZE_ID: "GTM-5WLRLQR",
  AJO_SCRIPT_SRC:
    "https://assets.adobedtm.com/780a4200c611/d0ee840fd05e/launch-a9f2d48e404f-development.min.js",
  KIUI_NUXT_MIDDLEWARE_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_NUXT_ENDPOINT_LOG_LEVEL: "warn" as LogLevelType,
  KIUI_ENV_NAME: "dev",

  OWND_INFLOW_REDIS_URL: "redis://localhost:6379",

  // TODO: 旧環境のファイルサーバの画像を参照するためだけに使われている. 画像を移行しさえすれば消せる.
  LEGACY_HOST: "",
};
