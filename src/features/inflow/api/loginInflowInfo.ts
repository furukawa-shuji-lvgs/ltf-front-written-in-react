import { z } from "zod";

export const loginInflowCookieName = "login_inflow_info";
export const loginInflowCookieMaxAgeSeconds = 60 * 30;

export const loginInflowSchema = z.object({
  startPage: z.string().min(1),
  endPage: z.string().min(1),
  referer: z.string().default(""),
  inflowMedia: z.literal("ltf"),
});

export type LoginInflowInfo = z.infer<typeof loginInflowSchema>;

export const encodeLoginInflowCookie = (info: LoginInflowInfo): string =>
  Buffer.from(JSON.stringify(info), "utf8").toString("base64url");
