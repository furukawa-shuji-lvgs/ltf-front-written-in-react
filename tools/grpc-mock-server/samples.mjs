const sampleLanguages = ["Java", "TypeScript"];
const sampleTitles = ["Java開発支援", "TypeScript移行支援"];

/** @param {string} normalized */
const sampleDescription = (normalized) => {
  if (
    normalized.includes("content") ||
    normalized.includes("body") ||
    normalized.includes("html")
  ) {
    return "<p>VRT確認用の本文です。見出し、段落、一覧表示が崩れないことを確認できるよう、実画面に近い文章量を入れています。</p><h2>案件の特徴</h2><ul><li>リモート相談可</li><li>長期参画を想定</li><li>チーム開発</li></ul>";
  }
  if (normalized.includes("message") || normalized.includes("text")) {
    return "VRT確認用のテキストです。複数行になっても表示崩れが分かるように少し長めにしています。";
  }

  return null;
};

/**
 * @param {string} fieldName
 * @param {number} index
 */
export const sampleText = (fieldName, index) => {
  const normalized = fieldName.toLowerCase();
  const number = index + 1;

  const contact = sampleContact(normalized, number);
  if (contact !== null) {
    return contact;
  }
  if (normalized.includes("skill")) {
    return sampleLanguages[index] ?? "React";
  }
  if (normalized.includes("jobtype") || normalized.includes("position")) {
    return "サーバーサイドエンジニア";
  }
  if (normalized.includes("category")) {
    return number === 1 ? "Webサービス" : "業務システム";
  }
  if (normalized.includes("title")) {
    return `VRT用の詳細タイトル ${number}`;
  }
  if (normalized.includes("subtitle")) {
    return "画面確認用のサブタイトル";
  }
  if (normalized.includes("description") || normalized.includes("meta")) {
    return "VRTで余白、折り返し、説明文エリアを確認するための十分な長さを持つモック説明文です。";
  }
  const description = sampleDescription(normalized);
  if (description !== null) {
    return description;
  }
  if (normalized.includes("name")) {
    return sampleTitles[index] ?? "React画面改善";
  }
  if (normalized.includes("keyword")) {
    return number === 1 ? "Java" : "リモート";
  }
  if (normalized.includes("sip")) {
    return "vrt-mock-sip";
  }

  return `VRT Mock ${number}`;
};

/**
 * @param {string} fieldName
 * @param {number} index
 */
export const sampleNumber = (fieldName, index) => {
  const normalized = fieldName.toLowerCase();
  const number = index + 1;

  if (normalized === "id" || normalized.endsWith("id")) {
    return 1000 + number;
  }
  if (normalized.includes("count") || normalized.includes("total")) {
    return normalized.includes("page") ? 3 : 42;
  }
  if (normalized.includes("currentpage")) {
    return 1;
  }
  if (normalized.includes("itemsperpage")) {
    return 20;
  }
  if (
    normalized.includes("price") ||
    normalized.includes("payment") ||
    normalized.includes("income")
  ) {
    return 700_000 + index * 100_000;
  }
  if (normalized.includes("assess")) {
    return 780_000 + index * 50_000;
  }
  if (normalized.includes("year")) {
    return index + 2;
  }
  if (normalized.includes("day")) {
    return index + 3;
  }
  if (normalized.includes("month")) {
    return 12;
  }

  return number;
};

/**
 * @param {string} normalized
 * @param {number} number
 */
const sampleContact = (normalized, number) => {
  if (normalized.includes("mail")) {
    return "mock@example.com";
  }
  if (normalized.includes("phone") || normalized.includes("tel")) {
    return "03-1234-5678";
  }
  if (
    normalized.includes("image") ||
    normalized.includes("thumbnail") ||
    normalized.includes("ogp")
  ) {
    return `https://placehold.jp/640x360.png?text=VRT+Mock+${number}`;
  }
  if (normalized.includes("url") || normalized.includes("uri") || normalized.includes("link")) {
    return `/project/detail/${1000 + number}/`;
  }
  if (normalized.includes("date")) {
    return "2026-07-04";
  }
  if (normalized.includes("station")) {
    return "渋谷";
  }
  if (normalized.includes("prefecture")) {
    return "東京都";
  }

  return null;
};
