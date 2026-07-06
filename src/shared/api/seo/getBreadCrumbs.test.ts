import { Result } from "@generated/results/result.ts";
import type { GetBreadCrumbsResponse } from "@generated/shared/seo.ts";
import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { getBreadCrumbsMock } = vi.hoisted(() => ({
  getBreadCrumbsMock: vi.fn(),
}));

vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn(() => ({
    getBreadCrumbs: getBreadCrumbsMock,
  })),
}));

vi.mock("@shared/lib/grpc/credentials", () => ({
  grpcCredentials: {},
  grpcCredentialOptions: {},
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    warn: vi.fn(),
  })),
}));

import { getBreadCrumbs } from "./getBreadCrumbs.ts";

const mockResponse = (response: Partial<GetBreadCrumbsResponse>) => {
  getBreadCrumbsMock.mockImplementation((...args: unknown[]) => {
    const callback = args.at(-1) as (
      err: unknown,
      response?: Partial<GetBreadCrumbsResponse>,
    ) => void;
    callback(null, response);
  });
};

describe("getBreadCrumbs", () => {
  beforeEach(() => {
    getBreadCrumbsMock.mockReset();
  });

  test("Success の場合に breadCrumbs をそのまま返すこと", async () => {
    const breadCrumbs = [
      { text: "TOP", url: "/" },
      { text: "お役立ち記事", url: "/guide/" },
    ];
    mockResponse({ result: Result.Success, breadCrumbs });

    const result = await getBreadCrumbs({ relativeUrlPath: "/guide/" });

    expect(getBreadCrumbsMock).toHaveBeenCalledWith(
      { relativeUrlPath: "/guide/" },
      expect.any(Metadata),
      expect.objectContaining({ deadline: expect.any(Date) }),
      expect.any(Function),
    );
    expect(result).toEqual({ breadCrumbs });
  });

  test("Success 以外の場合に空配列を返すこと", async () => {
    mockResponse({ result: Result.Internal });

    const result = await getBreadCrumbs({ relativeUrlPath: "/unknown/" });

    expect(result).toEqual({ breadCrumbs: [] });
  });

  test("通信エラーの場合に空配列を返すこと", async () => {
    const grpcError = new Error("UNAVAILABLE");
    getBreadCrumbsMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (err: unknown) => void;
      callback(grpcError);
    });

    await expect(getBreadCrumbs({ relativeUrlPath: "/guide/" })).resolves.toEqual({
      breadCrumbs: [],
    });
  });
});
