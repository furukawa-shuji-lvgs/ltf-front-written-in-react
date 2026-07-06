import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { TableOfContentsItem } from "./articleHtmlTypes.ts";
import { articleHeadingSelector } from "./articleToc.ts";

type FlatTocItem = { level: "h2" | "h3"; id: string; title: string };

export function removeExistingHeadingIds($: CheerioAPI): void {
  $(articleHeadingSelector).each((_, el) => {
    const $el = $(el);
    $el.removeAttr("id");
    $el.find("span[id], span[name]").removeAttr("id").removeAttr("name");
  });
}

export function applyTocIdsToHeadings($: CheerioAPI, toc: TableOfContentsItem[]): void {
  const flat = flattenToc(toc);
  if (flat.length === 0) return;

  const $headings = $(articleHeadingSelector);
  const first = flat[0];
  if (first === undefined) return;

  let startIdxInDom = -1;
  $headings.each((i, el) => {
    const level = getLevel(el as unknown as Element);
    if (level !== first.level) return true;

    const txt = normalize($(el).text());
    if (txt.includes(normalize(first.title))) {
      startIdxInDom = i;
      return false;
    }

    return true;
  });

  assignIdsFrom($, $headings, flat, startIdxInDom >= 0 ? startIdxInDom : 0);
}

const flattenToc = (toc: TableOfContentsItem[]): FlatTocItem[] =>
  toc.flatMap((sec) => [
    { level: "h2", id: String(sec.h2.id), title: sec.h2.title },
    ...sec.h3.map((h) => ({ level: "h3" as const, id: String(h.id), title: h.title })),
  ]);

const assignIdsFrom = (
  $: CheerioAPI,
  $headings: ReturnType<CheerioAPI>,
  flat: FlatTocItem[],
  domStart: number,
) => {
  let tocIdx = 0;

  for (let i = domStart; i < $headings.length && tocIdx < flat.length; i++) {
    const el = $headings[i] as unknown as Element;
    const level = getLevel(el);

    while (tocIdx < flat.length && flat[tocIdx]?.level !== level) {
      tocIdx++;
    }

    const flatItem = flat[tocIdx];
    if (flatItem === undefined) break;

    $(el).attr("id", flatItem.id);
    tocIdx++;
  }
};

function getLevel(el: Element): "h2" | "h3" {
  const tag = typeof el.name === "string" ? el.name.toLowerCase() : "";
  return tag === "h2" ? "h2" : "h3";
}

function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}
