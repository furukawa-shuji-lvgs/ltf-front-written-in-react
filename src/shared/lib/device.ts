import { headers } from "next/headers";

export type Device = "pc" | "sp";

const SP_UA_PATTERN = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i;

export const detectDevice = (userAgent: string | null): Device =>
  userAgent && SP_UA_PATTERN.test(userAgent) ? "sp" : "pc";

// Server Component / Route Handler 用。リクエストの UA から PC / SP を判定する。
// 旧 ltf-front の $device プラグイン相当。
export const getDevice = async (): Promise<Device> => {
  const headerList = await headers();
  return detectDevice(headerList.get("user-agent"));
};
