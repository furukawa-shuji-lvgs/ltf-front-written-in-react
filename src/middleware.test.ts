// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware.ts";

const run = (url: string) => middleware(new NextRequest(url));

describe("middleware", () => {
  describe("旧コンサルティング詳細ページのリダイレクト", () => {
    it("マップに一致するパスは 301 でリダイレクトすること", () => {
      const response = run("http://localhost/consulting/detail/1/");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/guide/detail/491/");
    });
  });

  describe("旧フリーランスページのリダイレクト", () => {
    it("/freelance/ は 301 で /guide/tag/1/ へリダイレクトすること", () => {
      const response = run("http://localhost/freelance/");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/guide/tag/1/");
    });

    it("移行元と同じくクエリパラメータは引き継がないこと", () => {
      const response = run("http://localhost/freelance/?foo=1");
      expect(response.headers.get("location")).toBe("http://localhost/guide/tag/1/");
    });
  });

  describe("旧ガイド詳細ページのリダイレクト", () => {
    it("マップに一致するパスは 301 でリダイレクトすること", () => {
      const response = run("http://localhost/guide/detail/4/");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/guide/detail/605/");
    });
  });

  describe("Brand ページへの外部リダイレクト", () => {
    it("マップに一致するパスは 301 で levtech.jp へリダイレクトすること", () => {
      const response = run("http://localhost/guide/detail/942/");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe(
        "https://levtech.jp/partner/guide/article/detail/34/",
      );
    });
  });

  describe("旧案件検索ページのリダイレクト", () => {
    it("前方一致するパスは 301 で /project/search/ へリダイレクトすること", () => {
      const response = run("http://localhost/project/pre_search/foo/");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/project/search/");
    });
  });

  describe("末尾スラッシュのリダイレクト", () => {
    it("末尾スラッシュなしのパスは 301 でスラッシュ付きパスへリダイレクトすること", () => {
      const response = run("http://localhost/guide");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/guide/");
    });

    it("クエリパラメータを維持してリダイレクトすること", () => {
      const response = run("http://localhost/project/search?page=2");
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("http://localhost/project/search/?page=2");
    });
  });

  describe("適用順序（Nuxt のファイル名アルファベット順と同じ）", () => {
    it("末尾スラッシュなしの旧ページは、まず末尾スラッシュのリダイレクトが適用されること（Nuxt と同じ2段リダイレクト）", () => {
      const first = run("http://localhost/consulting/detail/1");
      expect(first.status).toBe(301);
      expect(first.headers.get("location")).toBe("http://localhost/consulting/detail/1/");

      const second = run("http://localhost/consulting/detail/1/");
      expect(second.status).toBe(301);
      expect(second.headers.get("location")).toBe("http://localhost/guide/detail/491/");
    });
  });

  describe("リダイレクト対象外のパス", () => {
    it("末尾スラッシュ付きの通常パスはリダイレクトしないこと", () => {
      const response = run("http://localhost/project/search/");
      expect(response.headers.get("location")).toBeNull();
      expect(response.status).toBe(200);
    });

    it("トップページはリダイレクトしないこと", () => {
      const response = run("http://localhost/");
      expect(response.headers.get("location")).toBeNull();
      expect(response.status).toBe(200);
    });
  });

  describe("観測性", () => {
    it("通常ページ / 検証: request id / 期待: レスポンスにx-request-idを付与", () => {
      // Arrange
      const request = new NextRequest("http://localhost/project/search/", {
        headers: { "x-request-id": "request-id-1" },
      });

      // Act
      const response = middleware(request);

      // Assert
      expect(response.headers.get("x-request-id")).toBe("request-id-1");
    });

    it("リダイレクトページ / 検証: request id / 期待: リダイレクトレスポンスにx-request-idを付与", () => {
      // Arrange
      const request = new NextRequest("http://localhost/guide", {
        headers: { "x-request-id": "request-id-2" },
      });

      // Act
      const response = middleware(request);

      // Assert
      expect(response.status).toBe(301);
      expect(response.headers.get("x-request-id")).toBe("request-id-2");
    });
  });

  describe("セキュリティ", () => {
    it("通常ページ / 検証: CSP nonce / 期待: script-srcにnonceを含めunsafe-inlineを許可しない", () => {
      // Arrange
      const request = new NextRequest("http://localhost/project/search/");

      // Act
      const response = middleware(request);
      const csp = response.headers.get("Content-Security-Policy") ?? "";

      // Assert
      expect(csp).toContain("script-src 'self' 'nonce-");
      expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
      expect(csp).toContain("report-uri /api/csp-report");
    });

    it("リダイレクトページ / 検証: CSP nonce / 期待: リダイレクトレスポンスにもCSPを付与する", () => {
      // Arrange
      const request = new NextRequest("http://localhost/guide");

      // Act
      const response = middleware(request);

      // Assert
      expect(response.status).toBe(301);
      expect(response.headers.get("Content-Security-Policy")).toContain("script-src 'self'");
    });
  });
});
