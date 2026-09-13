/**
 * 末尾スラッシュなしのパス → 末尾スラッシュ付きパスへの301リダイレクト（クエリは維持する） 移行元と同じく、パスに "api" を含む場合はリダイレクトしない 移行元: ltf-front
 * app/middleware/trailingSlashRedirect.global.ts
 *
 * @returns 末尾スラッシュを補った URL。補正不要なら null。
 */
export const getTrailingSlashRedirect = (
  path: string,
  searchParams?: URLSearchParams,
): string | null => {
  if (path.endsWith("/") || /api/iu.exec(path)) {
    return null;
  }
  const query = searchParams?.toString();
  return query != null && query !== "" ? `${path}/?${query}` : `${path}/`;
};
