import type { CheerioAPI } from "cheerio";

import type { ProcessedArticleHtml, TableOfContentsItem } from "./articleHtmlTypes.ts";

import { applyTocIdsToHeadings, removeExistingHeadingIds } from "./articleHeadingIds.ts";
import { articleHtmlLogger, loadArticleHtml } from "./articleHtmlLoader.ts";
import { sanitizeArticleHtml } from "./articleHtmlSanitizer.ts";
import { collectToc } from "./articleToc.ts";
/** Guide記事本文のHTMLを、SSRで描画しやすい形に整える。 */

export { type ProcessedArticleHtml, type TableOfContentsItem } from "./articleHtmlTypes.ts";

export { getToc } from "./articleToc.ts";

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
  toc?: readonly TableOfContentsItem[],
): string | null {
  return processLoadedArticleContentForRender(loadArticleHtml(html), toc);
}

function processLoadedArticleContentForRender(
  $: CheerioAPI,
  toc?: readonly TableOfContentsItem[],
): string | null {
  $(".article__tableOfContents").remove();

  sanitizeArticleHtml($);
  addAnchorWithImageClass($);
  removeExistingHeadingIds($);

  if (Array.isArray(toc) && toc.length > 0) {
    try {
      applyTocIdsToHeadings($, toc);
    } catch (error) {
      articleHtmlLogger.warn({ err: error }, "Failed to apply TOC ids. Skipped.");
    }
  }

  return ($("head").html() ?? "") + $("body").html();
}

/** Imgを含むaタグがinlineのままだとimgを包含しない高さになりクリック領域が狭くなってしまうので、inline-block化するためのクラスを付与する */
function addAnchorWithImageClass($: CheerioAPI): void {
  void $("a").each((_, el) => {
    const $link = $(el);
    if ($link.find("img").length > 0) {
      $link.addClass("anchorWithImage");
    }
  });
}
