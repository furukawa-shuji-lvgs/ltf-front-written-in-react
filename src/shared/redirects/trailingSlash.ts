const regExpTrailingSlash = /\/$/;

/**
 * 末尾スラッシュなしのパス → 末尾スラッシュ付きパスへの301リダイレクト（クエリは維持する）
 * 移行元と同じく、パスに "api" を含む場合はリダイレクトしない
 * 移行元: ltf-front app/middleware/trailingSlashRedirect.global.ts
 */
export const getTrailingSlashRedirect = (
  path: string,
  searchParams?: URLSearchParams,
): string | null => {
  if (regExpTrailingSlash.test(path) || path.match(/api/iu)) return null;
  const query = searchParams?.toString();
  return query ? `${path}/?${query}` : `${path}/`;
};
