import {
  createOwndInflowSession,
  decodeOwndInflowSessionCookie,
  emptyOwndInflowSessionResponse,
  encodeOwndInflowSessionCookie,
  findOwndInflowSessionCookieValue,
  owndInflowCookieMaxAgeSeconds,
  owndInflowCookieName,
  sessionRequestSchema,
} from "@features/inflow/api/owndInflowSession.ts";
import { getCustomEnv } from "@shared/lib/env.ts";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null);
  const parsed = sessionRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid ownd-inflow session payload." }, { status: 400 });
  }

  const session = createOwndInflowSession(parsed.data);
  const response = NextResponse.json(session, {
    headers: { "cache-control": "no-store" },
  });

  response.cookies.set(owndInflowCookieName, encodeOwndInflowSessionCookie(session), {
    httpOnly: true,
    maxAge: owndInflowCookieMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: getCustomEnv() !== "local",
  });

  return response;
};

export const GET = (request: Request) => {
  const value = findOwndInflowSessionCookieValue(request.headers.get("cookie"));
  const session = value ? decodeOwndInflowSessionCookie(value) : null;

  return NextResponse.json(session ?? emptyOwndInflowSessionResponse, {
    headers: { "cache-control": "no-store" },
  });
};
