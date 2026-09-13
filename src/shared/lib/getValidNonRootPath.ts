import { getLogger } from "@shared/lib/logger.ts";

export type Candidates = {
  /**
   * SSR/CSRどちらでも取れるが、ルート以外のページで"/"になってしまう場合がある
   *
   * 取得方法: usePathname() など（クエリストリング・ハッシュの排除は不要）
   */
  readonly path?: string;
  /**
   * SSR/CSRどちらでも取れるが、ルート以外のページで"/"になってしまう場合がある
   *
   * 取得方法: パス + クエリストリングの文字列（クエリストリングの排除が必要）
   */
  readonly fullPath?: string;
  /**
   * SSRでしか取れないが、ルート以外のページで"/"になってしまう可能性は低い
   *
   * 取得方法: リクエストURLの pathname（クライアントサイドでは実行されない様に制御が必要）
   *
   * クエリストリング・ハッシュの排除は不要
   */
  readonly requestUrlPathname?: string;
};

/**
 * 有効な非ルートパスかどうかを判定し返す関数 path, fullPath, requestUrlPathname などを受け取り、最初に有効なものを返す。全て無効ならnull。
 *
 * @returns 最初の有効な非ルートパス。候補がなければ null。
 */
export function getValidNonRootPath({
  path,
  fullPath,
  requestUrlPathname,
}: Candidates): string | null {
  const logger = getLogger("getValidNonRootPath");
  if (path != null && path !== "" && path !== "/") {
    return path;
  }
  const cleanedFullPath =
    fullPath != null && fullPath !== "" && fullPath !== "/" ? removeQueryAndHash(fullPath) : null;
  if (cleanedFullPath !== null) {
    logger.warn(
      { path, fullPath, requestUrlPathname },
      "getValidNonRootPath: 'fullPath' is used as a fallback. Consider checking why 'path' is invalid.",
    );
    return cleanedFullPath;
  }
  if (requestUrlPathname != null && requestUrlPathname !== "" && requestUrlPathname !== "/") {
    logger.warn(
      { path, fullPath, requestUrlPathname },
      "getValidNonRootPath: 'requestUrl' is used as a fallback. Consider checking why 'path' and 'fullPath' are invalid.",
    );
    return requestUrlPathname;
  }
  logger.error(
    { path, fullPath, requestUrlPathname },
    "getValidNonRootPath: All candidates are invalid. Returning null.",
  );
  return null;
}

function removeQueryAndHash(path: string): string | null {
  const [removed] = path.split(/[?#]/u);
  // 「空文字の場合」や「クエリストリングから始まっている場合」は結果が空文字列になり、この関数の引数の期待値からは外れるので、明示的にnullを返す
  if (removed === "") {
    return null;
  }
  return removed ?? null;
}
