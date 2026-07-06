import { getLogger } from "@shared/lib/logger.ts";
import { z } from "zod";

const logger = getLogger("ownd-inflow-session");
const fallbackOrigin = "https://freelance.levtech.jp";

export const owndInflowCookieName = "ownd_inflow_session";
export const owndInflowCookieMaxAgeSeconds = 60 * 60 * 24 * 30;

export const sessionRequestSchema = z.object({
  fullPath: z.string().min(1),
  referer: z.string().default(""),
});

export const inflowSessionSchema = z.object({
  inflowInfo: z.object({
    startPage: z.string(),
    referer: z.string(),
    sip: z.string(),
    gclid: z.string(),
    searchKeyword: z.string(),
    gaClientId: z.string(),
    msLpNo: z.string(),
  }),
  accessHistories: z.array(
    z.object({
      page: z.string(),
      accessedAt: z.string(),
    }),
  ),
  endPage: z.string(),
});

export type SessionRequest = z.infer<typeof sessionRequestSchema>;
export type OwndInflowSession = z.infer<typeof inflowSessionSchema>;

const parseFullPath = (fullPath: string): URL => {
  try {
    return new URL(fullPath, fallbackOrigin);
  } catch {
    return new URL("/", fallbackOrigin);
  }
};

const readSearchParam = (url: URL, key: string): string => url.searchParams.get(key) ?? "";

export const createOwndInflowSession = (
  input: SessionRequest,
  accessedAt = new Date().toISOString(),
): OwndInflowSession => {
  const url = parseFullPath(input.fullPath);

  return {
    inflowInfo: {
      startPage: input.fullPath,
      referer: input.referer,
      sip: readSearchParam(url, "sip"),
      gclid: readSearchParam(url, "gclid"),
      searchKeyword: readSearchParam(url, "q"),
      gaClientId: readSearchParam(url, "_ga"),
      msLpNo: readSearchParam(url, "msLpNo"),
    },
    accessHistories: [
      {
        page: input.fullPath,
        accessedAt,
      },
    ],
    endPage: "",
  };
};

export const encodeOwndInflowSessionCookie = (session: OwndInflowSession): string =>
  Buffer.from(JSON.stringify(session), "utf8").toString("base64url");

export const decodeOwndInflowSessionCookie = (value: string): OwndInflowSession | null => {
  try {
    return inflowSessionSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
  } catch (error) {
    logger.warn({ error }, "Invalid ownd-inflow session cookie.");
    return null;
  }
};

export const findOwndInflowSessionCookieValue = (cookieHeader: string | null): string | null => {
  const cookies = cookieHeader?.split(";").map((cookie) => cookie.trim()) ?? [];
  const cookie = cookies.find((entry) => entry.startsWith(`${owndInflowCookieName}=`));

  return cookie ? decodeURIComponent(cookie.slice(owndInflowCookieName.length + 1)) : null;
};

export const emptyOwndInflowSessionResponse = {
  inflowInfo: null,
  accessHistories: [],
  endPage: "",
} as const;
