import type { Logger } from "@shared/lib/logger.ts";
import * as cheerio from "cheerio";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, test, vi } from "vitest";

type WarnArgs = Parameters<Logger["warn"]>;
type WarnLogger = (...args: WarnArgs) => void;

type TableOfContentsItem = {
  h2: { title: string; id: number };
  h3: { title: string; id: number }[];
};

// Create a mock function that we can access later
let mockWarn: Mock<WarnLogger>;

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    warn: (...args: WarnArgs) => mockWarn(...args),
  })),
}));

import * as utils from "./articleHtml.ts";

describe("processArticleHtml", () => {
  const { processArticleHtml } = utils;

  beforeEach(() => {
    mockWarn = vi.fn<WarnLogger>();
  });

  test("記事HTML / 検証: 目次生成とID付与 / 期待: 同じ解析結果でtocと描画HTMLを返す", () => {
    // Arrange
    const inputHtml = `
      <h2 class="article__ttlL">見出し1</h2>
      <h3 class="article__ttlM">小見出し1</h3>
      <h2 class="article__ttlL">見出し2</h2>
    `;

    // Act
    const result = processArticleHtml(inputHtml);

    // Assert
    const $ = cheerio.load(result.html ?? "");
    expect(result.toc).toEqual([
      {
        h2: { title: "見出し1", id: 1 },
        h3: [{ title: "小見出し1", id: 2 }],
      },
      {
        h2: { title: "見出し2", id: 3 },
        h3: [],
      },
    ] as TableOfContentsItem[]);
    expect($("h2.article__ttlL").eq(0).attr("id")).toBe("1");
    expect($("h3.article__ttlM").eq(0).attr("id")).toBe("2");
    expect($("h2.article__ttlL").eq(1).attr("id")).toBe("3");
  });
});

describe("processArticleContentForRender", () => {
  const { processArticleContentForRender } = utils;

  // Initialize the mock function
  beforeEach(() => {
    mockWarn = vi.fn<WarnLogger>();
  });

  test("空文字が渡された場合に、問題なく対応できること", () => {
    // Arrange
    const inputHtml = "";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    expect(result).toBe("");
  });

  test("無効なHTMLが渡された場合に、warningを表示しつつ、問題なく対応できること", () => {
    // Arrange
    const inputHtml = "<div><span>Test";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    expect(result).toBe("<div><span>Test</span></div>");
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid HTML detected in article content. Gracefully handled.",
    );
  });

  test("imgを含むaタグにanchorWithImageクラスが付与されること", () => {
    // Arrange
    const inputHtml = "<a href='#'><img src='test.jpg' alt='Test'></a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = cheerio.load(result ?? "");
    const $anchor = $("a");
    expect($anchor.hasClass("anchorWithImage")).toBe(true);
    expect($anchor.find("img").attr("src")).toBe("test.jpg");
    expect($anchor.find("img").attr("alt")).toBe("Test");
  });

  test("画像のないアンカーは保持される", () => {
    // Arrange
    const inputHtml = "<a href='#'>テキストのみリンク</a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = cheerio.load(result ?? "");
    const $anchor = $("a");
    expect($anchor.hasClass("anchorWithImage")).toBe(false);
    expect($anchor.text()).toBe("テキストのみリンク");
  });

  test("記事HTML / 検証: scriptタグ除去 / 期待: 本文テキストだけを保持", () => {
    // Arrange
    const inputHtml = "<section><p>本文</p><script>alert('xss')</script></section>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = cheerio.load(result ?? "");
    expect($("script").length, "scriptタグは描画HTMLへ残さない").toBe(0);
    expect($("section").text()).toBe("本文");
  });

  test("記事HTML / 検証: イベント属性除去 / 期待: 安全な属性だけを保持", () => {
    // Arrange
    const inputHtml = "<img src='test.jpg' alt='Test' onerror='alert(1)'>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = cheerio.load(result ?? "");
    expect($("img").attr("onerror"), "イベント属性は描画HTMLへ残さない").toBeUndefined();
    expect($("img").attr("src")).toBe("test.jpg");
    expect($("img").attr("alt")).toBe("Test");
  });

  test("記事HTML / 検証: 危険URL除去 / 期待: javascriptリンクをhrefなしで返す", () => {
    // Arrange
    const inputHtml = "<a href='javascript:alert(1)'>危険なリンク</a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = cheerio.load(result ?? "");
    expect($("a").attr("href"), "javascript URLはhrefから除去する").toBeUndefined();
    expect($("a").text()).toBe("危険なリンク");
  });
});

describe("getToc", () => {
  const { getToc } = utils;

  test("空文字が渡された場合に、空の配列を返すこと", () => {
    // Arrange
    const inputHtml = "";

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([] as TableOfContentsItem[]);
  });

  test("h2のみの場合、h3が空配列のTOCが生成されること", () => {
    // Arrange
    const inputHtml =
      "<h2 class='article__ttlL'><span id='1'>見出し1</span></h2><h2 class='article__ttlL'><span id='2'>見出し2</span></h2>";

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      { h2: { title: "見出し1", id: 1 }, h3: [] },
      { h2: { title: "見出し2", id: 2 }, h3: [] },
    ] as TableOfContentsItem[]);
  });

  test("h2とh3の組み合わせで正しくTOCが生成されること", () => {
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">メイン見出し1</span></h2>
            <h3 class="article__ttlM">サブ見出し1-1</h3>
            <h3 class="article__ttlM">サブ見出し1-2</h3>
            <h2 class="article__ttlL"><span id="2">メイン見出し2</span></h2>
            <h3 class="article__ttlM">サブ見出し2-1</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "メイン見出し1", id: 1 },
        h3: [
          { title: "サブ見出し1-1", id: 2 },
          { title: "サブ見出し1-2", id: 3 },
        ],
      },
      {
        h2: { title: "メイン見出し2", id: 4 },
        h3: [{ title: "サブ見出し2-1", id: 5 }],
      },
    ] as TableOfContentsItem[]);
  });

  test("h3にarticle__ttlLクラスが使われた場合も正しく処理されること", () => {
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">メイン見出し</span></h2>
            <h3 class="article__ttlM">通常のh3</h3>
            <h3 class="article__ttlL">特別なh3</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "メイン見出し", id: 1 },
        h3: [
          { title: "通常のh3", id: 2 },
          { title: "特別なh3", id: 3 },
        ],
      },
    ] as TableOfContentsItem[]);
  });

  test("h3がh2より前にある場合、無視されること", () => {
    // Arrange
    const inputHtml = `
            <h3 class="article__ttlM">先頭のh3</h3>
            <h2 class="article__ttlL"><span id="1">メイン見出し</span></h2>
            <h3 class="article__ttlM">正常なh3</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "メイン見出し", id: 1 },
        h3: [{ title: "正常なh3", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  test("タイトルにHTMLタグが含まれる場合、テキストのみが抽出されること", () => {
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">見出し<strong>太字</strong>テキスト</span></h2>
            <h3 class="article__ttlM">サブ見出し<em>強調</em>部分</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "見出し太字テキスト", id: 1 },
        h3: [{ title: "サブ見出し強調部分", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  test("前後に空白がある場合、trimされること", () => {
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">  見出し  </span></h2>
            <h3 class="article__ttlM">  サブ見出し  </h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "見出し", id: 1 },
        h3: [{ title: "サブ見出し", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  test("空のタイトルを持つ要素も処理されること", () => {
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1"></span></h2>
            <h3 class="article__ttlM"></h3>
            <h2 class="article__ttlL"><span id="2">正常な見出し</span></h2>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toEqual([
      {
        h2: { title: "", id: 1 },
        h3: [{ title: "", id: 2 }],
      },
      {
        h2: { title: "正常な見出し", id: 3 },
        h3: [],
      },
    ] as TableOfContentsItem[]);
  });
});

describe("processArticleContentForRender: 付加処理の詳細", () => {
  const { processArticleContentForRender } = utils;

  beforeEach(() => {
    mockWarn = vi.fn<WarnLogger>();
  });

  test("article__tableOfContents ブロックは削除される", () => {
    const inputHtml = `
      <div class="article__tableOfContents">ここは消える</div>
      <p>残るテキスト</p>
    `;
    const result = processArticleContentForRender(inputHtml) ?? "";
    const $ = cheerio.load(result);
    expect($(".article__tableOfContents").length).toBe(0);
    expect($("p").text()).toBe("残るテキスト");
  });

  test("h2/h3 の既存 id と子 span の id/name は一旦除去（toc無し）", () => {
    const inputHtml = `
      <h2 class="article__ttlL" id="old">H2 <span id="s1" name="s1">title</span></h2>
      <h3 class="article__ttlM" id="old3">H3 <span id="s2" name="s2">sub</span></h3>
    `;
    const result = processArticleContentForRender(inputHtml) ?? "";
    const $ = cheerio.load(result);

    const $h2 = $("h2.article__ttlL");

    expect($h2.length).toBeGreaterThan(0);
    expect($h2.attr("id")).toBeUndefined();
    expect($("h2.article__ttlL span").attr("id")).toBeUndefined();
    expect($("h2.article__ttlL span").attr("name")).toBeUndefined();

    const $h3 = $("h3.article__ttlM");

    expect($h3.length).toBeGreaterThan(0);
    expect($h3.attr("id")).toBeUndefined();
    expect($("h3.article__ttlM span").attr("id")).toBeUndefined();
    expect($("h3.article__ttlM span").attr("name")).toBeUndefined();
  });

  test("TOC を渡すと h2/h3 に ID を付与（span の有無に関わらず h2/h3 本体に付与）", () => {
    const inputHtml = `
      <h2 class="article__ttlL"><span>見出し1</span></h2>
      <h3 class="article__ttlM"><span>小見出し1-1</span></h3>
      <h3 class="article__ttlM">小見出し1-2（spanなし）</h3>
      <h2 class="article__ttlL"><span>見出し2</span></h2>
      <h3 class="article__ttlL"><span>小見出し2-1</span></h3>
    `;
    const toc: TableOfContentsItem[] = [
      {
        h2: { title: "見出し1", id: 101 },
        h3: [
          { title: "小見出し1-1", id: 102 },
          { title: "小見出し1-2（spanなし）", id: 103 },
        ],
      },
      {
        h2: { title: "見出し2", id: 201 },
        h3: [{ title: "小見出し2-1", id: 202 }],
      },
    ];

    const result = processArticleContentForRender(inputHtml, toc) ?? "";
    const $ = cheerio.load(result);

    const $h2s = $("h2.article__ttlL");
    const $h3s = $("h3.article__ttlM, h3.article__ttlL");

    expect($h2s.eq(0).attr("id")).toBe("101");
    expect($h2s.eq(1).attr("id")).toBe("201");

    expect($h3s.eq(0).attr("id")).toBe("102");
    expect($h3s.eq(1).attr("id")).toBe("103");
    expect($h3s.eq(2).attr("id")).toBe("202");
  });

  test("TOC 先頭一致位置から順に割当（見つからなければ0から）", () => {
    const inputHtml = `
            <h3 class="article__ttlM">これはスキップされるH3</h3>
            <h2 class="article__ttlL"><span>期待するH2</span></h2>
            <h3 class="article__ttlM"><span>次のH3</span></h3>
        `;
    const toc: TableOfContentsItem[] = [
      { h2: { title: "期待するH2", id: 900 }, h3: [{ title: "次のH3", id: 901 }] },
    ];

    const result = processArticleContentForRender(inputHtml, toc) ?? "";
    const $ = cheerio.load(result);

    expect($("h2.article__ttlL").attr("id")).toBe("900");

    const $h3s = $("h3.article__ttlM");
    expect($h3s.eq(0).attr("id")).toBeUndefined();
    expect($h3s.eq(1).attr("id")).toBe("901");
  });
});
