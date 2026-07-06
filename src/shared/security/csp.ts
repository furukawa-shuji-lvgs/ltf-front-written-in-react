import { getRuntimeEnv } from "@shared/lib/runtimeEnv.ts";

export const cspHeaderName = "Content-Security-Policy";
export const cspReportOnlyHeaderName = "Content-Security-Policy-Report-Only";
export const nonceHeaderName = "x-nonce";

const imageSources = [
  "'self'",
  "data:",
  "blob:",
  "https://lt-prd-ownd-images.s3.ap-northeast-1.amazonaws.com",
  "https://contents.levtech.jp",
  "https://freelance.stg.levtech.org",
  "https://freelance.levtech.jp",
] as const;

interface ContentSecurityPolicyOptions {
  nonce: string;
  nodeEnv?: string;
  reportOnly?: boolean;
}

export const buildContentSecurityPolicy = ({
  nonce,
  nodeEnv = getRuntimeEnv("NODE_ENV"),
  reportOnly = false,
}: ContentSecurityPolicyOptions): string => {
  const isDevelopment = nodeEnv === "development";
  const scriptSrc = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const styleSrc = reportOnly ? "style-src 'self'" : "style-src 'self' 'unsafe-inline'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    scriptSrc,
    styleSrc,
    `img-src ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    "connect-src 'self' https: ws:",
    "form-action 'self'",
    "report-uri /api/csp-report",
  ].join("; ");
};
