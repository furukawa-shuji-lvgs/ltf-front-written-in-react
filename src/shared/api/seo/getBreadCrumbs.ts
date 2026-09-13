import "server-only";
import type { GetBreadCrumbsRequest, GetBreadCrumbsResponse } from "@generated/shared/seo.ts";

import { callGrpcRequest, isGrpcResultSuccess } from "@shared/lib/grpc/request.ts";

import type { GetBreadCrumbsResponseDto } from "./types.ts";

import { sharedSeoClient } from "./client.ts";

const fallbackBreadCrumbsResponse: GetBreadCrumbsResponseDto = {
  breadCrumbs: [],
};

export const getBreadCrumbs = (
  req: Readonly<GetBreadCrumbsRequest>,
): Promise<GetBreadCrumbsResponseDto> =>
  callGrpcRequest<GetBreadCrumbsRequest, GetBreadCrumbsResponse, GetBreadCrumbsResponseDto>({
    name: "sharedSeo.getBreadCrumbs",
    method: sharedSeoClient.getBreadCrumbs.bind(sharedSeoClient),
    request: req,
    fallback: fallbackBreadCrumbsResponse,
    isSuccessful: isGrpcResultSuccess,
    mapResponse: (response) => ({
      breadCrumbs: response.breadCrumbs,
    }),
  });
