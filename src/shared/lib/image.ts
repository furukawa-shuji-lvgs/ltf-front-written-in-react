import "server-only";

import { getEnv } from "@shared/lib/env.ts";
import { localLegacyAssetPaths } from "./legacyAssets.ts";

/**
 * 画像 URL を解決する（旧 app/composables/useImage.ts の useImageBind 相当）
 *
 * - `https://` から始まる URL はそのまま返す
 * - それ以外（旧 `~/assets/images` 配下の相対パス）は旧環境のファイルサーバを参照する
 * - LEGACY_HOST が未設定の環境では、壊れた `/images/...` ではなく deterministic な SVG fallback を返す
 *
 * TODO: LEGACY_HOST は旧環境のファイルサーバの画像を参照するためだけに使われている。
 * 画像を本リポジトリ（public/ か S3）へ移行しさえすればこのプレフィックスは消せる。
 * Server Component から呼ぶこと（クライアントでは env を参照できない）。
 */
export const imageUrl = (src: string): string =>
  src.startsWith("https://") ? src : legacyImageUrl(src);

const legacyImageUrl = (src: string): string => {
  if (localLegacyAssetPaths.has(src)) return `/images${src}`;

  const legacyHost = getEnv().LEGACY_HOST;
  if (legacyHost) return `${legacyHost}/images${src}`;

  return legacyImageFallbackDataUri(src);
};

export const legacyImageFallbackDataUri = (src: string): string => {
  const filename = src.split("/").filter(Boolean).pop() ?? "legacy-image";
  const label = filename.replace(/\.(svg|png|jpe?g|webp)$/iu, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" viewBox="0 0 320 96" role="img" aria-label="${label}"><rect width="320" height="96" rx="8" fill="#f2f5f8"/><path d="M32 28h44v40H32z" fill="#d7e0ea"/><path d="M88 34h156v10H88zm0 18h200v10H88" stroke="#7a8794" stroke-width="8" stroke-linecap="round"/><text x="32" y="84" font-family="Arial,sans-serif" font-size="12" fill="#586575">${label}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
