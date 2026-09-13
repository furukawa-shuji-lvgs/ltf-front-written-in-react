import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, vi, it } from "vitest";

import type { GetBreadCrumbsRequest, GetBreadCrumbsResponse } from "@generated/shared/seo.ts";
import type { callGrpcRequest } from "@shared/lib/grpc/request.ts";
import type { Logger } from "@shared/lib/logger.ts";

import { Result } from "@generated/results/result.ts";

import { getBreadCrumbs } from "./getBreadCrumbs.ts";

type SeoMethod = Parameters<
  typeof callGrpcRequest<GetBreadCrumbsRequest, Partial<GetBreadCrumbsResponse>, unknown>
>[0]["method"];

const { getBreadCrumbsMock } = vi.hoisted(() => ({
  getBreadCrumbsMock: vi.fn<SeoMethod>(),
}));

// oxlint-disable-next-line vitest/prefer-import-in-mock -- 使用するRPCだけを実装する部分モックのため、モジュール全体の型照合を行わない。
vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn<() => { getBreadCrumbs: SeoMethod }>(() => ({
    getBreadCrumbs: getBreadCrumbsMock,
  })),
}));

// oxlint-disable-next-line vitest/prefer-import-in-mock -- 使用するRPCだけを実装する部分モックのため、モジュール全体の型照合を行わない。
vi.mock("@shared/lib/grpc/credentials", () => ({
  grpcCredentials: {},
  grpcCredentialOptions: {},
}));

vi.mock(import("@shared/lib/logger"), () => ({
  getLogger: vi.fn<() => Logger>(() => ({
    warn: vi.fn<Logger["warn"]>(),
    info: vi.fn<Logger["info"]>(),
    error: vi.fn<Logger["error"]>(),
  })),
}));

const mockResponse = (response: Partial<GetBreadCrumbsResponse>) => {
  getBreadCrumbsMock.mockImplementation((_request, _metadata, _options, callback) => {
    callback(null, response);
  });
};

describe(getBreadCrumbs, () => {
  beforeEach(() => {
    getBreadCrumbsMock.mockReset();
  });

  it("success の場合に breadCrumbs をそのまま返すこと", async () => {
    expect.hasAssertions();
    const breadCrumbs = [
      { text: "TOP", url: "/" },
      { text: "お役立ち記事", url: "/guide/" },
    ];
    mockResponse({ result: Result.Success, breadCrumbs });

    const result = await getBreadCrumbs({ relativeUrlPath: "/guide/" });

    expect(getBreadCrumbsMock).toHaveBeenCalledWith(
      { relativeUrlPath: "/guide/" },
      expect.any(Metadata),
      expect.objectContaining({ deadline: anyDate }),
      expect.any(Function),
    );
    expect(result).toStrictEqual({ breadCrumbs });
  });

  it("success 以外の場合に空配列を返すこと", async () => {
    expect.hasAssertions();
    mockResponse({ result: Result.Internal });

    const result = await getBreadCrumbs({ relativeUrlPath: "/unknown/" });

    expect(result).toStrictEqual({ breadCrumbs: [] });
  });

  it("通信エラーの場合に空配列を返すこと", async () => {
    expect.hasAssertions();
    const grpcError = new Error("UNAVAILABLE");
    getBreadCrumbsMock.mockImplementation((_request, _metadata, _options, callback) => {
      callback(grpcError);
    });

    await expect(getBreadCrumbs({ relativeUrlPath: "/guide/" })).resolves.toStrictEqual({
      breadCrumbs: [],
    });
  });
});

const anyDate: unknown = expect.any(Date);
