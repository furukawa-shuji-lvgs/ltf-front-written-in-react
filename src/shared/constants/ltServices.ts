import type { CustomEnv } from "@shared/types/env.ts";

import { getCustomEnv } from "@shared/lib/env.ts";

import { LtServices as development } from "./development.ts";
import { LtServices as production } from "./production.ts";
import { LtServices as staging } from "./staging.ts";

type LtServicesMap = {
  readonly LT_URL: string;
  readonly LTC_URL: string;
  readonly LTCR_URL: string;
  readonly LTP_URL: string;
  readonly LT_CO_URL: string;
  readonly [key: string]: string;
};

// 移行メモ: 移行元は Nuxt の runtimeConfig（customEnv）でモジュールを丸ごと切り替えていたが、
// 環境で値が変わるのは LtServices のみなので、getCustomEnv() による選択に再実装した
const envConstants = {
  local: development,
  development,
  staging,
  production,
} satisfies Readonly<Record<CustomEnv, LtServicesMap>>;

/** 環境ごとに切り替わる関連サービスの URL マップ（旧 `$c.LtServices`） */
export const LtServices: LtServicesMap = envConstants[getCustomEnv()];
