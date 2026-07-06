import "server-only";

import type { GetBreadCrumbsRequest, GetBreadCrumbsResponse } from "@generated/shared/seo.ts";
import { callGrpcRequest, isGrpcResultSuccess } from "@shared/lib/grpc/request.ts";
import { sharedSeoClient } from "./client.ts";
import type { GetBreadCrumbsResponseDto } from "./types.ts";

const fallbackBreadCrumbsResponse: GetBreadCrumbsResponseDto = {
  breadCrumbs: [],
};

export const getBreadCrumbs = async (
  req: GetBreadCrumbsRequest,
): Promise<GetBreadCrumbsResponseDto> => {
  return callGrpcRequest<GetBreadCrumbsRequest, GetBreadCrumbsResponse, GetBreadCrumbsResponseDto>({
    name: "sharedSeo.getBreadCrumbs",
    method: sharedSeoClient.getBreadCrumbs.bind(sharedSeoClient),
    request: req,
    fallback: fallbackBreadCrumbsResponse,
    isSuccessful: isGrpcResultSuccess,
    mapResponse: (response) => ({
      breadCrumbs: response.breadCrumbs,
    }),
  });
};
