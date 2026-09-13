import type { CheerioAPI } from "cheerio";

import type { TableOfContentsItem } from "./articleHtmlTypes.ts";

import { articleHeadingSelector } from "./articleToc.ts";

type FlatTocItem = { readonly level: "h2" | "h3"; readonly id: string; readonly title: string };

export function removeExistingHeadingIds($: CheerioAPI): void {
  $(articleHeadingSelector).each((_, el) => {
    const $el = $(el);
    $el.removeAttr("id");
    $el.find("span[id], span[name]").removeAttr("id").removeAttr("name");
  });
}

export function applyTocIdsToHeadings($: CheerioAPI, toc: readonly TableOfContentsItem[]): void {
  const flat = flattenToc(toc);
  if (flat.length === 0) {
    return;
  }

  const $headings = $(articleHeadingSelector);
  const [first] = flat;
  if (first === undefined) {
    return;
  }

  let startIdxInDom = -1;
  $headings.each((index, el) => {
    const level = getLevel(el);
    if (level !== first.level) {
      return true;
    }

    const txt = normalize($(el).text());
    if (txt.includes(normalize(first.title))) {
      startIdxInDom = index;
      return false;
    }

    return true;
  });

  assignIdsFrom($, $headings, flat, Math.max(startIdxInDom, 0));
}

const flattenToc = (toc: readonly TableOfContentsItem[]): readonly FlatTocItem[] =>
  toc.flatMap((sec) => [
    { level: "h2", id: String(sec.h2.id), title: sec.h2.title },
    ...sec.h3.map((heading) => ({
      level: "h3" as const,
      id: String(heading.id),
      title: heading.title,
    })),
  ]);

const assignIdsFrom = (
  $: CheerioAPI,
  $headings: ReturnType<CheerioAPI>,
  flat: readonly FlatTocItem[],
  domStart: number,
) => {
  let tocIdx = 0;

  for (let index = domStart; index < $headings.length && tocIdx < flat.length; index++) {
    const el = $headings[index];
    if (el === undefined) {
      continue;
    }

    const level = getLevel(el);

    while (tocIdx < flat.length && flat[tocIdx]?.level !== level) {
      tocIdx++;
    }

    const flatItem = flat[tocIdx];
    if (flatItem === undefined) {
      break;
    }

    $(el).attr("id", flatItem.id);
    tocIdx++;
  }
};

function getLevel(el: unknown): "h2" | "h3" {
  const name =
    typeof el === "object" && el !== null && "name" in el
      ? (el as { readonly name?: unknown }).name
      : undefined;
  const tag = typeof name === "string" ? name.toLowerCase() : "";
  return tag === "h2" ? "h2" : "h3";
}

function normalize(text: string): string {
  return text.replaceAll(/\s+/gu, "").toLowerCase();
}
