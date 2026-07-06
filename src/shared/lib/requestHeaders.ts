export const requestIdHeaderName = "x-request-id";

export const firstHeaderValue = (value: string | null): string | undefined =>
  value?.split(",")[0]?.trim() || undefined;

export const requestIdFromHeaders = (headers: Headers): string | undefined =>
  headers.get(requestIdHeaderName) ?? undefined;

export const requestIpKeyFor = (headers: Headers): string =>
  firstHeaderValue(headers.get("x-forwarded-for")) ?? headers.get("x-real-ip") ?? "unknown";
