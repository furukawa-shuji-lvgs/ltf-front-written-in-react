import type { CheerioAPI } from "cheerio";

import { load as loadHtml } from "cheerio";

import { getLogger } from "@shared/lib/logger.ts";

const logger = getLogger("articleHtml.ts");

export const loadArticleHtml = (html: string): CheerioAPI => {
  const $ = loadHtml(html);

  if (($("head").html() ?? "") + $("body").html() !== html) {
    logger.warn("Invalid HTML detected in article content. Gracefully handled.");
  }

  return $;
};

export const articleHtmlLogger = logger;
