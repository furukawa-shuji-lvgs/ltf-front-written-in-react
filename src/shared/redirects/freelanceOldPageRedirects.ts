import { createMapRedirectResolver } from "./redirectResolver.ts";

// リダイレクト先: /guide/tag/1/
const guideTagUri = "/guide/tag/1/";
const buildFreelanceRedirectMap = (): Record<string, string> => {
  // リダイレクト対象: /freelance/
  const map: Record<string, string> = {
    "/freelance/": guideTagUri,
  };
  // リダイレクト対象: /freelance/detail/{1..29}/
  for (let detailNumber = 1; detailNumber <= 29; detailNumber++) {
    map[`/freelance/detail/${detailNumber}/`] = guideTagUri;
  }
  return map;
};
export const freelanceOldPageRedirectMap = buildFreelanceRedirectMap();

/**
 * 旧フリーランスページ → ガイドタグページへの301リダイレクト
 * リダイレクト設定一覧シート：https://docs.google.com/spreadsheets/d/1a8xMgI3lUYhYUP_lxsLbiEWfHswYvmqwif6yri9hxj4/#gid=1482486242
 * 移行元: ltf-front app/middleware/redirectFreelanceOldPage.global.ts
 */
export const getFreelanceOldPageRedirect = createMapRedirectResolver(freelanceOldPageRedirectMap);
