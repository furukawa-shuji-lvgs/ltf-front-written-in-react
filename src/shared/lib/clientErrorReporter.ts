"use client";

const clientErrorEndpoint = "/api/client-errors";

export interface ClientErrorReport {
  message: string;
  digest?: string;
  path?: string;
  userAgent?: string;
}

export const buildClientErrorReportPayload = (report: ClientErrorReport): ClientErrorReport => {
  if (typeof window === "undefined") return report;

  return {
    ...report,
    path: report.path ?? `${window.location.pathname}${window.location.search}`,
    userAgent: report.userAgent ?? window.navigator.userAgent,
  };
};

export const reportClientError = (report: ClientErrorReport): void => {
  const payload = buildClientErrorReportPayload(report);

  void fetch(clientErrorEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
};
