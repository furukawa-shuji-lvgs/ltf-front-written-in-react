"use client";
const clientErrorEndpoint = "/api/client-errors";

export interface ClientErrorReport {
  readonly message: string;
  readonly digest?: string;
  readonly path?: string;
  readonly userAgent?: string;
}

export const buildClientErrorReportPayload = (report: ClientErrorReport): ClientErrorReport => {
  if (globalThis.window === undefined) {
    return report;
  }

  return {
    ...report,
    path: report.path ?? `${globalThis.location.pathname}${globalThis.location.search}`,
    userAgent: report.userAgent ?? globalThis.navigator.userAgent,
  };
};

export const reportClientError = (report: ClientErrorReport): void => {
  const payload = buildClientErrorReportPayload(report);

  void fetch(clientErrorEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    // oxlint-disable-next-line promise/prefer-await-to-then -- 遷移や描画を待たせずに送信し、通信失敗だけを吸収する。
  }).catch(() => {});
};
