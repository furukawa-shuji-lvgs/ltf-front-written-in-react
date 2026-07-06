/**
 * ltf-react 管理の画像 URL を public/images 配下へ解決する。
 *
 * - `https://...` / `http://...` / `data:...` は外部またはインライン画像としてそのまま返す
 * - `/images/...` は既に公開パスなのでそのまま返す
 * - `/common/...` などの ltf-react 管理アセットは `/images/common/...` に変換する
 */
export const imageUrl = (src: string): string => {
  if (
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("data:") ||
    src.startsWith("/images/")
  ) {
    return src;
  }

  return `/images${src.startsWith("/") ? src : `/${src}`}`;
};
