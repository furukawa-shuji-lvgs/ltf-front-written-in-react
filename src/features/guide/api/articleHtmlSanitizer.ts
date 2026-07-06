import type * as cheerio from "cheerio";

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
const asciiControlMaxCodePoint = 0x1f;
const asciiDeleteCodePoint = 0x7f;

export function sanitizeArticleHtml($: cheerio.CheerioAPI): void {
  $(dangerousElementSelectors.join(",")).remove();

  $("*").each((_, element) => {
    const attributes = "attribs" in element ? element.attribs : undefined;
    if (!attributes) return;

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
  if (trimmed.length === 0) return true;
  if (trimmed.startsWith("#")) return true;

  const compact = Array.from(trimmed)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return (
        codePoint > asciiControlMaxCodePoint &&
        codePoint !== asciiDeleteCodePoint &&
        character.trim().length > 0
      );
    })
    .join("")
    .toLowerCase();

  if (
    compact.startsWith("javascript:") ||
    compact.startsWith("vbscript:") ||
    compact.startsWith("data:text/") ||
    compact.startsWith("data:application/")
  ) {
    return false;
  }

  if (/^data:image\/(?:gif|jpeg|jpg|png|webp);base64,/i.test(trimmed)) {
    return true;
  }

  try {
    const url = new URL(trimmed, "https://freelance.levtech.jp");
    return safeUrlProtocols.has(url.protocol);
  } catch {
    return false;
  }
}
