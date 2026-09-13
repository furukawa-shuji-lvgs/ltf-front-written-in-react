import "server-only";
import type { GetTdkhRequest, GetTdkhResponse } from "@generated/shared/seo.ts";

import { callGrpcRequest, isGrpcResultSuccess } from "@shared/lib/grpc/request.ts";

import type { GetTdkhResponseDto } from "./types.ts";

import { sharedSeoClient } from "./client.ts";

const fallbackTdkhResponse: GetTdkhResponseDto = {
  tdkh: {
    key: "",
    title: "",
    description: "",
    keywords: "",
    h1: "",
  },
};

export const getTdkh = (req: Readonly<GetTdkhRequest>): Promise<GetTdkhResponseDto> =>
  callGrpcRequest<GetTdkhRequest, GetTdkhResponse, GetTdkhResponseDto>({
    name: "sharedSeo.getTdkh",
    method: sharedSeoClient.getTdkh.bind(sharedSeoClient),
    request: req,
    fallback: fallbackTdkhResponse,
    isSuccessful: isGrpcResultSuccess,
    mapResponse: (response) => ({
      tdkh: {
        key: response.tdkh?.key ?? "",
        title: response.tdkh?.title ?? "",
        description: response.tdkh?.description ?? "",
        keywords: response.tdkh?.keywords ?? "",
        h1: response.tdkh?.h1 ?? "",
      },
    }),
  });
