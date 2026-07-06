import type { Logger } from "@shared/lib/logger.ts";

/**
 * ルート情報のプレーンな表現
 *
 * 移行メモ: 移行元は Nuxt の useRoute() の戻り値を受け取っていたが、
 * Next では usePathname() / useSearchParams() / useParams() などから組み立てたプレーンな値を受け取るように API を変更した
 */
export type RouteInfo = {
  path: string;
  fullPath: string;
  params: Record<string, string | string[]>;
};

const isInvalidNonRootPath = (value: string): boolean => value === "/";

const reportFallback = (
  logger: Logger,
  field: "path" | "fullPath" | "params",
  payload: Record<string, unknown>,
) => {
  logger.error(payload, `Invalid route ${field} detected. Applying fallback.`);
};

/**
 * 非 root ページで Next/Nuxt 互換 route 情報が root 扱いになった場合に、
 * リクエスト URL から復元できる値だけを補正する。
 */
export function safeRouteForNonRootPage(
  route: RouteInfo,
  logger: Logger,
  /** 注意：「リクエストURLの出力値は信頼性が高い」と仮定している */
  requestUrl: URL,
  getRequiredParams: () => string[],
  getFallbackParams: () => RouteInfo["params"],
): RouteInfo {
  const isServer = typeof window === "undefined";
  const { path, fullPath, params } = route;
  const fallbackPath = (original: RouteInfo["path"]) => {
    if (isInvalidNonRootPath(original)) {
      const fallback = requestUrl.pathname;
      reportFallback(logger, "path", {
        isServer,
        isClient: !isServer,
        original,
        fallback,
        route,
        requestURL: requestUrl,
      });
      return fallback;
    }
    return original;
  };
  const fallbackFullPath = (original: RouteInfo["fullPath"]) => {
    if (isInvalidNonRootPath(original)) {
      const fallback = requestUrl.pathname + requestUrl.search;
      reportFallback(logger, "fullPath", {
        isServer,
        isClient: !isServer,
        original,
        fallback,
        route,
        requestURL: requestUrl,
      });
      return fallback;
    }
    return original;
  };
  const fallbackParams = (original: RouteInfo["params"]) => {
    const missingParams = getRequiredParams().filter((parameter) => !original[parameter]);
    if (missingParams.length > 0) {
      const fallback: RouteInfo["params"] = getFallbackParams();
      reportFallback(logger, "params", {
        isServer,
        isClient: !isServer,
        original,
        fallback,
        missingParams,
        route,
        requestURL: requestUrl,
      });
      return fallback;
    }
    return original;
  };

  return {
    path: fallbackPath(path),
    fullPath: fallbackFullPath(fullPath),
    params: fallbackParams(params),
  };
}
