import { getLogger } from "@shared/lib/logger.ts";
import { checkRateLimit } from "@shared/lib/rateLimit.ts";
import { RequestBodyTooLargeError, readLimitedRequestText } from "@shared/lib/requestBody.ts";
import { requestIdFromHeaders, requestIpKeyFor } from "@shared/lib/requestHeaders.ts";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CSP_REPORT_MAX_BODY_BYTES = 16_384;
const cspReportRateLimit = {
  max: 120,
  windowMs: 60_000,
};

const logger = getLogger("csp-report");

const retryAfterSeconds = (resetAt: number): string =>
  String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1_000)));

export const POST = async (request: Request) => {
  const rateLimit = checkRateLimit(requestIpKeyFor(request.headers), cspReportRateLimit);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many CSP reports." },
      {
        status: 429,
        headers: {
          "retry-after": retryAfterSeconds(rateLimit.resetAt),
          "cache-control": "no-store",
        },
      },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  let text: string;
  try {
    text = await readLimitedRequestText(request, CSP_REPORT_MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ message: "CSP report payload is too large." }, { status: 413 });
    }
    return NextResponse.json({ message: "Invalid CSP report payload." }, { status: 400 });
  }

  let body: unknown = text;
  if (contentType.includes("json") || contentType.includes("csp-report")) {
    try {
      body = text.length === 0 ? null : JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Invalid CSP report payload." }, { status: 400 });
    }
  }

  logger.warn(
    { body, requestId: requestIdFromHeaders(request.headers) ?? "" },
    "CSP violation report received.",
  );

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
};
