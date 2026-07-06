export const CRAWLER_HEADER_NAME = "x-crawler";

/**
 * クローラーからのアクセスかどうかを判定する
 *
 * 移行メモ: 移行元は H3Event を受け取っていたが、Next では next/headers の headers() が返す
 * Headers オブジェクトを受け取るように API を変更した
 */
export const isCrawler = (headers?: Headers | null): boolean => {
  if (!headers) {
    return false;
  }

  return headers.has(CRAWLER_HEADER_NAME);
};
