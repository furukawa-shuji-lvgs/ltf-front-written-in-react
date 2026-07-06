import { getCustomEnv } from "@shared/lib/env.ts";
import type { CustomEnv } from "@shared/types/env.ts";
import * as development from "./development.ts";
import * as production from "./production.ts";
import * as staging from "./staging.ts";

type LtServicesMap = {
  LT_URL: string;
  LTC_URL: string;
  LTCR_URL: string;
  LTP_URL: string;
  LT_CO_URL: string;
  [key: string]: string;
};

// 移行メモ: 移行元は Nuxt の runtimeConfig（customEnv）でモジュールを丸ごと切り替えていたが、
// 環境で値が変わるのは LtServices のみなので、getCustomEnv() による選択に再実装した
const envConstants = {
  local: development,
  development,
  staging,
  production,
} satisfies Record<CustomEnv, { LtServices: LtServicesMap }>;

/** 環境ごとに切り替わる関連サービスの URL マップ（旧 `$c.LtServices`） */
export const LtServices: LtServicesMap = envConstants[getCustomEnv()].LtServices;
