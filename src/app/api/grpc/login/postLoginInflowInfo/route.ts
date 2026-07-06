import {
  encodeLoginInflowCookie,
  loginInflowCookieMaxAgeSeconds,
  loginInflowCookieName,
  loginInflowSchema,
} from "@features/inflow/api/loginInflowInfo.ts";
import { getCustomEnv } from "@shared/lib/env.ts";
import { getLogger } from "@shared/lib/logger.ts";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const logger = getLogger("login-inflow");

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null);
  const parsed = loginInflowSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid login inflow payload." }, { status: 400 });
  }

  logger.info({ inflow: parsed.data }, "Login inflow info received.");

  const response = NextResponse.json(
    { result: "Success" },
    { headers: { "cache-control": "no-store" } },
  );

  response.cookies.set(loginInflowCookieName, encodeLoginInflowCookie(parsed.data), {
    httpOnly: true,
    maxAge: loginInflowCookieMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: getCustomEnv() !== "local",
  });

  return response;
};
