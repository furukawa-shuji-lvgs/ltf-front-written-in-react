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
import { type NextRequest, NextResponse } from "next/server";

const resolveRequestId = (request: NextRequest): string =>
  request.headers.get(requestIdHeaderName) ?? crypto.randomUUID();

const createNonce = (): string => crypto.randomUUID().replaceAll("-", "");

const withResponseHeaders = (
  response: NextResponse,
  {
    requestId,
    nonce,
  }: {
    requestId: string;
    nonce: string;
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
 * 1. redirectConsultingDetailOldPage.global.ts
 * 2. redirectFreelanceOldPage.global.ts
 * 3. redirectGuideDetailPage.global.ts
 * 4. redirectGuideDetailPageToBrandUri.global.ts
 * 5. redirectOldProjectSearch.global.ts
 * 6. session.global.ts（クライアント側の OwndInflowSessionRecorder と API Route で移植）
 * 7. trailingSlashRedirect.global.ts
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

  if (destination) {
    return withResponseHeaders(NextResponse.redirect(new URL(destination, request.url), 301), {
      requestId,
      nonce,
    });
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
  // api・Next.js 内部アセット・画像・拡張子付きファイルは対象外
  matcher: ["/((?!api|_next/static|_next/image|images|.*\\..*).*)"],
};
