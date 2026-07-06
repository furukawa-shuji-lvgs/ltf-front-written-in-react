/**
 * guide記事本文のHTMLを、SSRで描画しやすい形に整える。
 */

import type { CheerioAPI } from "cheerio";
import { applyTocIdsToHeadings, removeExistingHeadingIds } from "./articleHeadingIds.ts";
import { articleHtmlLogger, loadArticleHtml } from "./articleHtmlLoader.ts";
import { sanitizeArticleHtml } from "./articleHtmlSanitizer.ts";
import type { ProcessedArticleHtml, TableOfContentsItem } from "./articleHtmlTypes.ts";
import { collectToc, getToc } from "./articleToc.ts";

export type { ProcessedArticleHtml, TableOfContentsItem };
export { getToc };

export const processArticleHtml = (html: string): ProcessedArticleHtml => {
  const $ = loadArticleHtml(html);
  const toc = collectToc($);

  return {
    html: processLoadedArticleContentForRender($, toc),
    toc,
  };
};

export function processArticleContentForRender(
  html: string,
  toc?: TableOfContentsItem[],
): string | null {
  return processLoadedArticleContentForRender(loadArticleHtml(html), toc);
}

function processLoadedArticleContentForRender(
  $: CheerioAPI,
  toc?: TableOfContentsItem[],
): string | null {
  $(".article__tableOfContents").remove();

  sanitizeArticleHtml($);
  addAnchorWithImageClass($);
  removeExistingHeadingIds($);

  if (Array.isArray(toc) && toc.length > 0) {
    try {
      applyTocIdsToHeadings($, toc);
    } catch (e) {
      articleHtmlLogger.warn({ err: e }, "Failed to apply TOC ids. Skipped.");
    }
  }

  return ($("head").html() ?? "") + $("body").html();
}

/**
 * imgを含むaタグがinlineのままだとimgを包含しない高さになりクリック領域が狭くなってしまうので、inline-block化するためのクラスを付与する
 */
function addAnchorWithImageClass($: CheerioAPI): void {
  void $("a").each((_, el) => {
    const $link = $(el);
    if ($link.find("img").length > 0) {
      $link.addClass("anchorWithImage");
    }
  });
}
