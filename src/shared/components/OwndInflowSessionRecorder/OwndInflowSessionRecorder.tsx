"use client";

import { useEffect } from "react";

const sessionEndpoint = "/api/ownd-inflow/session";
const landingSegment = "/landing/";

const isCompletePage = (pathname: string): boolean => pathname.endsWith("/complete/");

const resolveFullPath = (location: Location, referrer: string): string => {
  const landingIndex = referrer.indexOf(landingSegment);
  if (landingIndex >= 0) {
    return referrer.slice(landingIndex);
  }

  return `${location.pathname}${location.search}${location.hash}`;
};

export const OwndInflowSessionRecorder = () => {
  useEffect(() => {
    if (isCompletePage(window.location.pathname)) {
      return;
    }

    const fullPath = resolveFullPath(window.location, document.referrer);

    void fetch(sessionEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullPath,
        referer: document.referrer,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
};
