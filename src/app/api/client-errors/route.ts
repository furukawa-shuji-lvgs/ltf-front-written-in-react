import { NextResponse } from "next/server";
import { z } from "zod";

import { trackError } from "@shared/lib/errorTracking.ts";
import { checkRateLimit } from "@shared/lib/rateLimit.ts";
import { RequestBodyTooLargeError, readLimitedRequestJson } from "@shared/lib/requestBody.ts";
import {
  firstHeaderValue,
  requestIdFromHeaders,
  requestIpKeyFor,
} from "@shared/lib/requestHeaders.ts";

export const runtime = "nodejs";
const CLIENT_ERROR_MAX_BODY_BYTES = 8192;
const maxMessageOrPathLength = 2048;
const maxDigestLength = 256;
const maxUserAgentLength = 512;
const millisecondsPerSecond = 1000;

const clientErrorRateLimit = {
  max: 30,
  windowMs: 60_000,
};

const clientErrorSchema = z.object({
  message: z.string().min(1).max(maxMessageOrPathLength),
  digest: z.string().max(maxDigestLength).optional(),
  path: z.string().max(maxMessageOrPathLength).optional(),
  userAgent: z.string().max(maxUserAgentLength).optional(),
});

const retryAfterSeconds = (resetAt: number): string =>
  String(Math.max(1, Math.ceil((resetAt - Date.now()) / millisecondsPerSecond)));

export const POST = async (request: Request) => {
  const rateLimit = checkRateLimit(requestIpKeyFor(request.headers), clientErrorRateLimit);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many client error reports." },
      {
        status: 429,
        headers: {
          "retry-after": retryAfterSeconds(rateLimit.resetAt),
          "cache-control": "no-store",
        },
      },
    );
  }

  let body: unknown = null;
  try {
    body = await readLimitedRequestJson(request, CLIENT_ERROR_MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ message: "Client error payload is too large." }, { status: 413 });
    }
    return NextResponse.json({ message: "Invalid client error payload." }, { status: 400 });
  }

  const parsed = clientErrorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid client error payload." }, { status: 400 });
  }

  trackError({
    source: "client",
    message: parsed.data.message,
    ...(parsed.data.digest === undefined ? {} : { digest: parsed.data.digest }),
    ...(parsed.data.path === undefined ? {} : { path: parsed.data.path }),
    ...(parsed.data.userAgent === undefined ? {} : { userAgent: parsed.data.userAgent }),
    context: {
      requestUrl: request.url,
      requestUserAgent: request.headers.get("user-agent") ?? "",
      forwardedFor: firstHeaderValue(request.headers.get("x-forwarded-for")) ?? "",
      requestId: requestIdFromHeaders(request.headers) ?? "",
    },
  });

  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
};
