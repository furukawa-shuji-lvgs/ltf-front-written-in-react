import { load as loadHtml } from "cheerio";
import { beforeEach, describe, expect, vi, it } from "vitest";

import type { Logger } from "@shared/lib/logger.ts";

import { requireString } from "../../../../tests/assertions.ts";
import { getToc, processArticleContentForRender, processArticleHtml } from "./articleHtml.ts";

type WarnArgs = Parameters<Logger["warn"]>;
type WarnLogger = (...args: Readonly<WarnArgs>) => void;

type TableOfContentsItem = {
  h2: { title: string; id: number };
  h3: { title: string; id: number }[];
};

// Create a mock function that we can access later
const { mockWarn } = vi.hoisted(() => ({ mockWarn: vi.fn<WarnLogger>() }));

vi.mock(import("@shared/lib/logger"), () => ({
  getLogger: vi.fn<() => Logger>(() => ({
    warn: (...args: Readonly<WarnArgs>) => {
      mockWarn(...args);
    },
    info: vi.fn<Logger["info"]>(),
    error: vi.fn<Logger["error"]>(),
  })),
}));

describe(processArticleHtml, () => {
  beforeEach(() => {
    mockWarn.mockReset();
  });

  it("記事HTML / 検証: 目次生成とID付与 / 期待: 同じ解析結果でtocと描画HTMLを返す", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
      <h2 class="article__ttlL">見出し1</h2>
      <h3 class="article__ttlM">小見出し1</h3>
      <h2 class="article__ttlL">見出し2</h2>
    `;

    // Act
    const result = processArticleHtml(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result.html));
    expect(result.toc).toStrictEqual([
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

describe(processArticleContentForRender, () => {
  // Initialize the mock function
  beforeEach(() => {
    mockWarn.mockReset();
  });

  it("空文字が渡された場合に、問題なく対応できること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    expect(result).toBe("");
  });

  it("無効なHTMLが渡された場合に、warningを表示しつつ、問題なく対応できること", () => {
    expect.hasAssertions();
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

  it("imgを含むaタグにanchorWithImageクラスが付与されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "<a href='#'><img src='test.jpg' alt='Test'></a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result));
    const $anchor = $("a");
    expect($anchor.hasClass("anchorWithImage")).toBe(true);
    expect($anchor.find("img").attr("src")).toBe("test.jpg");
    expect($anchor.find("img").attr("alt")).toBe("Test");
  });

  it("画像のないアンカーは保持される", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "<a href='#'>テキストのみリンク</a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result));
    const $anchor = $("a");
    expect($anchor.hasClass("anchorWithImage")).toBe(false);
    expect($anchor.text()).toBe("テキストのみリンク");
  });

  it("記事HTML / 検証: scriptタグ除去 / 期待: 本文テキストだけを保持", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "<section><p>本文</p><script>alert('xss')</script></section>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result));
    expect($("script")).toHaveLength(0);
    expect($("section").text()).toBe("本文");
  });

  it("記事HTML / 検証: イベント属性除去 / 期待: 安全な属性だけを保持", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "<img src='test.jpg' alt='Test' onerror='alert(1)'>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result));
    expect($("img").attr("onerror"), "イベント属性は描画HTMLへ残さない").toBeUndefined();
    expect($("img").attr("src")).toBe("test.jpg");
    expect($("img").attr("alt")).toBe("Test");
  });

  it("記事HTML / 検証: 危険URL除去 / 期待: javascriptリンクをhrefなしで返す", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "<a href='javascript:alert(1)'>危険なリンク</a>";

    // Act
    const result = processArticleContentForRender(inputHtml);

    // Assert
    const $ = loadHtml(requireString(result));
    expect($("a").attr("href"), "javascript URLはhrefから除去する").toBeUndefined();
    expect($("a").text()).toBe("危険なリンク");
  });
});

describe(getToc, () => {
  it("空文字が渡された場合に、空の配列を返すこと", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = "";

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([] as TableOfContentsItem[]);
  });

  it("h2のみの場合、h3が空配列のTOCが生成されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml =
      "<h2 class='article__ttlL'><span id='1'>見出し1</span></h2><h2 class='article__ttlL'><span id='2'>見出し2</span></h2>";

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
      { h2: { title: "見出し1", id: 1 }, h3: [] },
      { h2: { title: "見出し2", id: 2 }, h3: [] },
    ] as TableOfContentsItem[]);
  });

  it("h2とh3の組み合わせで正しくTOCが生成されること", () => {
    expect.hasAssertions();
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
    expect(result).toStrictEqual([
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

  it("h3にarticle__ttlLクラスが使われた場合も正しく処理されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">メイン見出し</span></h2>
            <h3 class="article__ttlM">通常のh3</h3>
            <h3 class="article__ttlL">特別なh3</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
      {
        h2: { title: "メイン見出し", id: 1 },
        h3: [
          { title: "通常のh3", id: 2 },
          { title: "特別なh3", id: 3 },
        ],
      },
    ] as TableOfContentsItem[]);
  });

  it("h3がh2より前にある場合、無視されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
            <h3 class="article__ttlM">先頭のh3</h3>
            <h2 class="article__ttlL"><span id="1">メイン見出し</span></h2>
            <h3 class="article__ttlM">正常なh3</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
      {
        h2: { title: "メイン見出し", id: 1 },
        h3: [{ title: "正常なh3", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  it("タイトルにHTMLタグが含まれる場合、テキストのみが抽出されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">見出し<strong>太字</strong>テキスト</span></h2>
            <h3 class="article__ttlM">サブ見出し<em>強調</em>部分</h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
      {
        h2: { title: "見出し太字テキスト", id: 1 },
        h3: [{ title: "サブ見出し強調部分", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  it("前後に空白がある場合、trimされること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1">  見出し  </span></h2>
            <h3 class="article__ttlM">  サブ見出し  </h3>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
      {
        h2: { title: "見出し", id: 1 },
        h3: [{ title: "サブ見出し", id: 2 }],
      },
    ] as TableOfContentsItem[]);
  });

  it("空のタイトルを持つ要素も処理されること", () => {
    expect.hasAssertions();
    // Arrange
    const inputHtml = `
            <h2 class="article__ttlL"><span id="1"></span></h2>
            <h3 class="article__ttlM"></h3>
            <h2 class="article__ttlL"><span id="2">正常な見出し</span></h2>
        `;

    // Act
    const result = getToc(inputHtml);

    // Assert
    expect(result).toStrictEqual([
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
  beforeEach(() => {
    mockWarn.mockReset();
  });

  it("article__tableOfContents ブロックは削除される", () => {
    expect.hasAssertions();
    const inputHtml = `
      <div class="article__tableOfContents">ここは消える</div>
      <p>残るテキスト</p>
    `;
    const result = requireString(processArticleContentForRender(inputHtml));
    const $ = loadHtml(result);
    expect($(".article__tableOfContents")).toHaveLength(0);
    expect($("p").text()).toBe("残るテキスト");
  });

  it("h2/h3 の既存 id と子 span の id/name は一旦除去（toc無し）", () => {
    expect.hasAssertions();
    const inputHtml = `
      <h2 class="article__ttlL" id="old">H2 <span id="s1" name="s1">title</span></h2>
      <h3 class="article__ttlM" id="old3">H3 <span id="s2" name="s2">sub</span></h3>
    `;
    const result = requireString(processArticleContentForRender(inputHtml));
    const $ = loadHtml(result);

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

  it("tOC を渡すと h2/h3 に ID を付与（span の有無に関わらず h2/h3 本体に付与）", () => {
    expect.hasAssertions();
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

    const result = requireString(processArticleContentForRender(inputHtml, toc));
    const $ = loadHtml(result);

    const $h2s = $("h2.article__ttlL");
    const $h3s = $("h3.article__ttlM, h3.article__ttlL");

    expect($h2s.eq(0).attr("id")).toBe("101");
    expect($h2s.eq(1).attr("id")).toBe("201");

    expect($h3s.eq(0).attr("id")).toBe("102");
    expect($h3s.eq(1).attr("id")).toBe("103");
    expect($h3s.eq(2).attr("id")).toBe("202");
  });

  it("tOC 先頭一致位置から順に割当（見つからなければ0から）", () => {
    expect.hasAssertions();
    const inputHtml = `
            <h3 class="article__ttlM">これはスキップされるH3</h3>
            <h2 class="article__ttlL"><span>期待するH2</span></h2>
            <h3 class="article__ttlM"><span>次のH3</span></h3>
        `;
    const toc: TableOfContentsItem[] = [
      { h2: { title: "期待するH2", id: 900 }, h3: [{ title: "次のH3", id: 901 }] },
    ];

    const result = requireString(processArticleContentForRender(inputHtml, toc));
    const $ = loadHtml(result);

    expect($("h2.article__ttlL").attr("id")).toBe("900");

    const $h3s = $("h3.article__ttlM");
    expect($h3s.eq(0).attr("id")).toBeUndefined();
    expect($h3s.eq(1).attr("id")).toBe("901");
  });
});
