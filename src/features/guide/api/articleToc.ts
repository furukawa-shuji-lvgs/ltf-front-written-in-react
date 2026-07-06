import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import type { TableOfContentsItem } from "./articleHtmlTypes.ts";

const headingSelector = "h2.article__ttlL, h3.article__ttlM, h3.article__ttlL";
const excludeH2Titles = ["目次", "ご登録者様限定機能詳しく見る"];

export const articleHeadingSelector = headingSelector;

export function getToc(html: string): TableOfContentsItem[] {
  if (!html) return [];

  return collectToc(cheerio.load(html));
}

export function collectToc($: CheerioAPI): TableOfContentsItem[] {
  const tocItems: TableOfContentsItem[] = [];
  let currentH2: TableOfContentsItem | null = null;
  let globalIdCounter = 1;

  $(headingSelector).each((_, element: Element) => {
    const $element = $(element);
    const tagName = element.name.toLowerCase();
    const text = $element.text().trim();

    if (tagName === "h2") {
      if (excludeH2Titles.includes(text)) {
        currentH2 = null;
        return;
      }

      currentH2 = {
        h2: {
          title: text,
          id: globalIdCounter++,
        },
        h3: [],
      };
      tocItems.push(currentH2);
      return;
    }

    if (tagName === "h3" && currentH2) {
      currentH2.h3.push({
        title: text,
        id: globalIdCounter++,
      });
    }
  });

  return tocItems;
}
