import { trackError } from "@shared/lib/errorTracking.ts";
import { checkRateLimit } from "@shared/lib/rateLimit.ts";
import { RequestBodyTooLargeError, readLimitedRequestJson } from "@shared/lib/requestBody.ts";
import {
  firstHeaderValue,
  requestIdFromHeaders,
  requestIpKeyFor,
} from "@shared/lib/requestHeaders.ts";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const CLIENT_ERROR_MAX_BODY_BYTES = 8_192;
const clientErrorRateLimit = {
  max: 30,
  windowMs: 60_000,
};

const clientErrorSchema = z.object({
  message: z.string().min(1).max(2_048),
  digest: z.string().max(256).optional(),
  path: z.string().max(2048).optional(),
  userAgent: z.string().max(512).optional(),
});

const retryAfterSeconds = (resetAt: number): string =>
  String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1_000)));

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

  let body: unknown;
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
