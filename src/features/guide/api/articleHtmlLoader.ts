import { getLogger } from "@shared/lib/logger.ts";
import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";

const logger = getLogger("articleHtml.ts");

export const loadArticleHtml = (html: string): CheerioAPI => {
  const $ = cheerio.load(html);

  if (($("head").html() ?? "") + $("body").html() !== html) {
    logger.warn("Invalid HTML detected in article content. Gracefully handled.");
  }

  return $;
};

export const articleHtmlLogger = logger;
