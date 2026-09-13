"use client";

import { useEffect } from "react";

const sessionEndpoint = "/api/ownd-inflow/session";
const landingSegment = "/landing/";

const isCompletePage = (pathname: string): boolean => pathname.endsWith("/complete/");

const resolveFullPath = (location: Location, referrer: string): string => {
  const landingIndex = referrer.indexOf(landingSegment);
  if (landingIndex !== -1) {
    return referrer.slice(landingIndex);
  }

  return `${location.pathname}${location.search}${location.hash}`;
};

export const OwndInflowSessionRecorder = () => {
  useEffect(() => {
    if (isCompletePage(globalThis.location.pathname)) {
      return;
    }

    const fullPath = resolveFullPath(globalThis.location, document.referrer);

    void fetch(sessionEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullPath,
        referer: document.referrer,
      }),
      keepalive: true,
      // oxlint-disable-next-line promise/prefer-await-to-then -- 遷移や描画を待たせずに送信し、通信失敗だけを吸収する。
    }).catch(() => {});
  }, []);

  return null;
};
