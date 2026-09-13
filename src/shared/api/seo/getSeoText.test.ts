import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, vi, it } from "vitest";

import type { GetSeoTextRequest, GetSeoTextResponse } from "@generated/shared/seo.ts";
import type { callGrpcRequest } from "@shared/lib/grpc/request.ts";
import type { Logger } from "@shared/lib/logger.ts";

import { Result } from "@generated/results/result.ts";

import { getSeoText } from "./getSeoText.ts";

type SeoMethod = Parameters<
  typeof callGrpcRequest<GetSeoTextRequest, Partial<GetSeoTextResponse>, unknown>
>[0]["method"];

const { getSeoTextMock } = vi.hoisted(() => ({
  getSeoTextMock: vi.fn<SeoMethod>(),
}));

// oxlint-disable-next-line vitest/prefer-import-in-mock -- 使用するRPCだけを実装する部分モックのため、モジュール全体の型照合を行わない。
vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn<() => { getSeoText: SeoMethod }>(() => ({
    getSeoText: getSeoTextMock,
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

const mockResponse = (response: Partial<GetSeoTextResponse>) => {
  getSeoTextMock.mockImplementation((_request, _metadata, _options, callback) => {
    callback(null, response);
  });
};

describe(getSeoText, () => {
  beforeEach(() => {
    getSeoTextMock.mockReset();
  });

  it("success の場合に StringValue を unwrap して DTO にマッピングすること", async () => {
    expect.hasAssertions();
    mockResponse({
      result: Result.Success,
      seoText: {
        title: { value: "タイトル" },
        text: { value: "本文" },
        secondTitle: { value: "第二タイトル" },
        secondText: { value: "第二本文" },
      },
    });

    const result = await getSeoText({ relativeUrlPath: "/guide/" });

    expect(getSeoTextMock).toHaveBeenCalledWith(
      { relativeUrlPath: "/guide/" },
      expect.any(Metadata),
      expect.objectContaining({ deadline: anyDate }),
      expect.any(Function),
    );
    expect(result).toStrictEqual({
      seoText: {
        title: "タイトル",
        text: "本文",
        secondTitle: "第二タイトル",
        secondText: "第二本文",
      },
    });
  });

  it("success でも seoText の項目が欠けている場合は undefined になること", async () => {
    expect.hasAssertions();
    mockResponse({ result: Result.Success, seoText: { title: { value: "タイトルのみ" } } });

    const result = await getSeoText({ relativeUrlPath: "/guide/" });

    expect(result).toStrictEqual({
      seoText: {
        title: "タイトルのみ",
      },
    });
    expect(result.seoText.text).toBeUndefined();
    expect(result.seoText.secondTitle).toBeUndefined();
    expect(result.seoText.secondText).toBeUndefined();
  });

  it("success 以外の場合に空の DTO を返すこと", async () => {
    expect.hasAssertions();
    mockResponse({ result: Result.NotFound });

    const result = await getSeoText({ relativeUrlPath: "/unknown/" });

    expect(result).toStrictEqual({ seoText: {} });
  });

  it("通信エラーの場合に空の DTO を返すこと", async () => {
    expect.hasAssertions();
    const grpcError = new Error("UNAVAILABLE");
    getSeoTextMock.mockImplementation((_request, _metadata, _options, callback) => {
      callback(grpcError);
    });

    await expect(getSeoText({ relativeUrlPath: "/guide/" })).resolves.toStrictEqual({
      seoText: {},
    });
  });
});

const anyDate: unknown = expect.any(Date);
