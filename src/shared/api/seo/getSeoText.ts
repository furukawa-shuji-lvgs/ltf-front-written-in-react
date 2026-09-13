import "server-only";
import type { GetSeoTextRequest, GetSeoTextResponse } from "@generated/shared/seo.ts";

import { callGrpcRequest, isGrpcResultSuccess } from "@shared/lib/grpc/request.ts";

import type { GetSeoTextResponseDto } from "./types.ts";

import { sharedSeoClient } from "./client.ts";

const fallbackSeoTextResponse: GetSeoTextResponseDto = {
  seoText: {},
};

export const getSeoText = (req: Readonly<GetSeoTextRequest>): Promise<GetSeoTextResponseDto> =>
  callGrpcRequest<GetSeoTextRequest, GetSeoTextResponse, GetSeoTextResponseDto>({
    name: "sharedSeo.getSeoText",
    method: sharedSeoClient.getSeoText.bind(sharedSeoClient),
    request: req,
    fallback: fallbackSeoTextResponse,
    isSuccessful: isGrpcResultSuccess,
    mapResponse: (response) => {
      const seoText: {
        -readonly [
          Key in keyof GetSeoTextResponseDto["seoText"]
        ]: GetSeoTextResponseDto["seoText"][Key];
      } = {};
      if (response.seoText?.title?.value !== undefined) {
        seoText.title = response.seoText.title.value;
      }
      if (response.seoText?.text?.value !== undefined) {
        seoText.text = response.seoText.text.value;
      }
      if (response.seoText?.secondTitle?.value !== undefined) {
        seoText.secondTitle = response.seoText.secondTitle.value;
      }
      if (response.seoText?.secondText?.value !== undefined) {
        seoText.secondText = response.seoText.secondText.value;
      }

      return {
        seoText,
      };
    },
  });
