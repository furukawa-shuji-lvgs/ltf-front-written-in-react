import "server-only";

import type { GetSeoTextRequest, GetSeoTextResponse } from "@generated/shared/seo.ts";
import { callGrpcRequest, isGrpcResultSuccess } from "@shared/lib/grpc/request.ts";
import { sharedSeoClient } from "./client.ts";
import type { GetSeoTextResponseDto } from "./types.ts";

const fallbackSeoTextResponse: GetSeoTextResponseDto = {
  seoText: {},
};

export const getSeoText = async (req: GetSeoTextRequest): Promise<GetSeoTextResponseDto> => {
  return callGrpcRequest<GetSeoTextRequest, GetSeoTextResponse, GetSeoTextResponseDto>({
    name: "sharedSeo.getSeoText",
    method: sharedSeoClient.getSeoText.bind(sharedSeoClient),
    request: req,
    fallback: fallbackSeoTextResponse,
    isSuccessful: isGrpcResultSuccess,
    mapResponse: (response) => {
      const seoText: GetSeoTextResponseDto["seoText"] = {};
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
};
