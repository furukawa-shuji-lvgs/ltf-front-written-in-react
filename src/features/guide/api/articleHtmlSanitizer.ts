import type { CheerioAPI } from "cheerio";

const asciiControlMaxCodePoint = 31;
const asciiDeleteCodePoint = 127;

const dangerousElementSelectors = [
  "base",
  "embed",
  "iframe",
  "link",
  "meta",
  "object",
  "script",
  "style",
  "template",
] as const;

const urlAttributeNames = new Set([
  "action",
  "formaction",
  "href",
  "poster",
  "src",
  "srcset",
  "xlink:href",
]);

const safeUrlProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

export function sanitizeArticleHtml($: CheerioAPI): void {
  $(dangerousElementSelectors.join(",")).remove();

  $("*").each((_, element) => {
    const attributes = "attribs" in element ? element.attribs : undefined;
    if (!attributes) {
      return;
    }

    for (const attributeName of Object.keys(attributes)) {
      const normalizedAttributeName = attributeName.toLowerCase();
      const attributeValue = attributes[attributeName] ?? "";

      if (normalizedAttributeName.startsWith("on")) {
        $(element).removeAttr(attributeName);
        continue;
      }

      if (
        urlAttributeNames.has(normalizedAttributeName) &&
        !isSafeUrlAttributeValue(attributeValue)
      ) {
        $(element).removeAttr(attributeName);
      }
    }
  });
}

function isSafeUrlAttributeValue(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return true;
  }
  if (trimmed.startsWith("#")) {
    return true;
  }

  let compact = "";
  for (const character of trimmed) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (
      codePoint > asciiControlMaxCodePoint &&
      codePoint !== asciiDeleteCodePoint &&
      character.trim().length > 0
    ) {
      compact += character;
    }
  }
  compact = compact.toLowerCase();

  if (
    // oxlint-disable-next-line eslint/no-script-url -- 記事 HTML の危険な URL スキームを拒否する比較。
    compact.startsWith("javascript:") ||
    compact.startsWith("vbscript:") ||
    compact.startsWith("data:text/") ||
    compact.startsWith("data:application/")
  ) {
    return false;
  }

  if (/^data:image\/(?:gif|jpeg|jpg|png|webp);base64,/iu.test(trimmed)) {
    return true;
  }

  try {
    const url = new URL(trimmed, "https://freelance.levtech.jp");
    return safeUrlProtocols.has(url.protocol);
  } catch {
    return false;
  }
}
