"use client";
const loginInflowEndpoint = "/api/grpc/login/postLoginInflowInfo";
const inflowMedia = "ltf";

export interface LoginInflowPayload {
  readonly startPage: string;
  readonly endPage: string;
  readonly referer: string;
  readonly inflowMedia: typeof inflowMedia;
}

export const buildLoginInflowPayload = (endPage: string): LoginInflowPayload => ({
  startPage: `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`,
  endPage,
  referer: document.referrer,
  inflowMedia,
});

export const postLoginInflowInfo = async (endPage: string): Promise<void> => {
  await fetch(loginInflowEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(buildLoginInflowPayload(endPage)),
    keepalive: true,
  });
};
