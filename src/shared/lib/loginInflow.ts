"use client";

const loginInflowEndpoint = "/api/grpc/login/postLoginInflowInfo";
const inflowMedia = "ltf";

export interface LoginInflowPayload {
  startPage: string;
  endPage: string;
  referer: string;
  inflowMedia: typeof inflowMedia;
}

export const buildLoginInflowPayload = (endPage: string): LoginInflowPayload => ({
  startPage: `${window.location.pathname}${window.location.search}${window.location.hash}`,
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
