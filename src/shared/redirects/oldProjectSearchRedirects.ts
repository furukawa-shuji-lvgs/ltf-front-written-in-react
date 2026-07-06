import { createPrefixRedirectResolver } from "./redirectResolver.ts";

/**
 * 旧案件検索ページ→案件検索ページへのリダイレクト
 * @description 旧案件検索ページへのリクエストが完全に無くなったら削除を検討すること
 * @see
 * - pre_search：https://app.asana.com/1/15797530005296/project/1209695970741925/task/1210682202593114
 * - easy_search：https://lvgs.slack.com/archives/C9HU5B6SD/p1780460599646149?thread_ts=1780459650.991439&cid=C9HU5B6SD
 * 移行元: ltf-front app/middleware/redirectOldProjectSearch.global.ts
 */
export const oldProjectSearchPaths = ["/project/pre_search/", "/project/easy_search/"];

const projectSearchUri = "/project/search/";

export const getOldProjectSearchRedirect = createPrefixRedirectResolver(
  oldProjectSearchPaths,
  projectSearchUri,
);
