import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { requestIdHeaderName } from "@shared/lib/requestHeaders.ts";
import { getConsultingDetailRedirect } from "@shared/redirects/consultingDetailRedirects.ts";
import { getFreelanceOldPageRedirect } from "@shared/redirects/freelanceOldPageRedirects.ts";
import { getGuideDetailBrandRedirect } from "@shared/redirects/guideDetailBrandRedirects.ts";
import { getGuideDetailRedirect } from "@shared/redirects/guideDetailRedirects.ts";
import { getOldProjectSearchRedirect } from "@shared/redirects/oldProjectSearchRedirects.ts";
import { getTrailingSlashRedirect } from "@shared/redirects/trailingSlash.ts";
import {
  buildContentSecurityPolicy,
  cspHeaderName,
  cspReportOnlyHeaderName,
  nonceHeaderName,
} from "@shared/security/csp.ts";

const permanentRedirectStatus = 301;

const resolveRequestId = (request: NextRequest): string =>
  request.headers.get(requestIdHeaderName) ?? crypto.randomUUID();

const createNonce = (): string => crypto.randomUUID().replaceAll("-", "");

const withResponseHeaders = (
  response: NextResponse,
  {
    requestId,
    nonce,
  }: {
    readonly requestId: string;
    readonly nonce: string;
  },
): NextResponse => {
  response.headers.set(requestIdHeaderName, requestId);
  response.headers.set(cspHeaderName, buildContentSecurityPolicy({ nonce }));
  response.headers.set(
    cspReportOnlyHeaderName,
    buildContentSecurityPolicy({ nonce, reportOnly: true }),
  );
  return response;
};

/**
 * Nuxt のグローバルミドルウェア（ファイル名のアルファベット順に実行）を同じ順序で適用する
 *
 * 1. RedirectConsultingDetailOldPage.global.ts
 * 2. RedirectFreelanceOldPage.global.ts
 * 3. RedirectGuideDetailPage.global.ts
 * 4. RedirectGuideDetailPageToBrandUri.global.ts
 * 5. RedirectOldProjectSearch.global.ts
 * 6. Session.global.ts（クライアント側の OwndInflowSessionRecorder と API Route で移植）
 * 7. TrailingSlashRedirect.global.ts
 *
 * @returns リダイレクトまたはセキュリティヘッダーを付与したレスポンス。
 */
export const middleware = (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;
  const requestId = resolveRequestId(request);
  const nonce = createNonce();

  const destination =
    getConsultingDetailRedirect(pathname) ??
    getFreelanceOldPageRedirect(pathname) ??
    getGuideDetailRedirect(pathname) ??
    getGuideDetailBrandRedirect(pathname) ??
    getOldProjectSearchRedirect(pathname) ??
    getTrailingSlashRedirect(pathname, searchParams);

  if (destination != null && destination !== "") {
    return withResponseHeaders(
      NextResponse.redirect(new URL(destination, request.url), permanentRedirectStatus),
      {
        requestId,
        nonce,
      },
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(requestIdHeaderName, requestId);
  requestHeaders.set(nonceHeaderName, nonce);
  requestHeaders.set(cspHeaderName, buildContentSecurityPolicy({ nonce }));

  return withResponseHeaders(NextResponse.next({ request: { headers: requestHeaders } }), {
    requestId,
    nonce,
  });
};

export const config = {
  // Api・Next.js 内部アセット・画像・拡張子付きファイルは対象外
  // oxlint-disable-next-line unicorn/prefer-string-raw -- Next.js は matcher を文字列リテラルとして静的解析する。
  matcher: ["/((?!api|_next/static|_next/image|images|.*\\..*).*)"],
};
