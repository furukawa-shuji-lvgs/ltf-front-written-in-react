import type { Metadata } from "next";

import type { Tdkh } from "@shared/api/seo/types.ts";
import type { HEAD_DATA } from "@shared/constants/common.ts";

import { getCustomEnv, getEnv } from "@shared/lib/env.ts";

type OgType = keyof typeof HEAD_DATA.ogp.type;

interface PageMetaOptions {
  /** OGP の og:type（デフォルトは article。旧 $c.HEAD_DATA.ogp.type 相当） */
  readonly ogType?: OgType;
}

/**
 * ページの絶対 URL を組み立てる 旧実装の `$c.LtServices.LTF_URL + path.slice(1)` 相当（BASE_URL はプロトコルを含まないため環境から補完する）
 *
 * @returns 環境のホスト名から生成した絶対 URL。
 */
const buildPageUrl = (path: string): string => {
  const env = getCustomEnv();
  const protocol = env === "staging" || env === "production" ? "https" : "http";
  return `${protocol}://${getEnv().BASE_URL}${path}`;
};

/**
 * TDKH と パス から Next.js の generateMetadata 用の Metadata を組み立てる
 *
 * 旧実装ではページごとに useHead({ title, meta: [description, keywords, og:*], link: [canonical] }) を
 * 設定していた（例: app/pages/guide/index.vue）。その共通部分を App Router 向けにまとめたもの。
 *
 * @param tdkh GRPC shared/seo getTdkh で取得した TDKH
 * @param path ルートからの絶対パス（例: "/guide/"）
 * @param options OGP 種別などの任意設定。
 * @returns ページの SEO と OGP メタデータ。
 */
export const createPageMetadata = (
  tdkh: Tdkh,
  path: string,
  options?: PageMetaOptions,
): Metadata => {
  const url = buildPageUrl(path);

  return {
    title: tdkh.title,
    description: tdkh.description,
    keywords: tdkh.keywords,
    openGraph: {
      title: tdkh.title,
      description: tdkh.description,
      type: options?.ogType ?? "article",
      url,
    },
    alternates: {
      canonical: url,
    },
  };
};
