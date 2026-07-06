import type { Tdkh } from "@shared/api/seo/types.ts";
import { HEAD_DATA } from "@shared/constants/common.ts";
import { getCustomEnv, getEnv } from "@shared/lib/env.ts";
import type { Metadata } from "next";

type OgType = keyof typeof HEAD_DATA.ogp.type;

interface PageMetaOptions {
  /** OGP の og:type（デフォルトは article。旧 $c.HEAD_DATA.ogp.type 相当） */
  ogType?: OgType;
}

/**
 * ページの絶対 URL を組み立てる
 * 旧実装の `$c.LtServices.LTF_URL + path.slice(1)` 相当（BASE_URL はプロトコルを含まないため環境から補完する）
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
 * @param tdkh gRPC shared/seo getTdkh で取得した TDKH
 * @param path ルートからの絶対パス（例: "/guide/"）
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
      type: HEAD_DATA.ogp.type[options?.ogType ?? "article"] as OgType,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
};
