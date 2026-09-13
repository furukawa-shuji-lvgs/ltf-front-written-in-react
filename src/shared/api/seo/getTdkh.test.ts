import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, vi, it } from "vitest";

import type { GetTdkhRequest, GetTdkhResponse } from "@generated/shared/seo.ts";
import type { callGrpcRequest } from "@shared/lib/grpc/request.ts";
import type { Logger } from "@shared/lib/logger.ts";

import { Result } from "@generated/results/result.ts";

import { getTdkh } from "./getTdkh.ts";

type SeoMethod = Parameters<
  typeof callGrpcRequest<GetTdkhRequest, Partial<GetTdkhResponse>, unknown>
>[0]["method"];

const { getTdkhMock } = vi.hoisted(() => ({
  getTdkhMock: vi.fn<SeoMethod>(),
}));

// oxlint-disable-next-line vitest/prefer-import-in-mock -- 使用するRPCだけを実装する部分モックのため、モジュール全体の型照合を行わない。
vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn<() => { getTdkh: SeoMethod }>(() => ({
    getTdkh: getTdkhMock,
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

const mockResponse = (response: Partial<GetTdkhResponse>) => {
  getTdkhMock.mockImplementation((_request, _metadata, _options, callback) => {
    callback(null, response);
  });
};

describe(getTdkh, () => {
  beforeEach(() => {
    getTdkhMock.mockReset();
  });

  it("success の場合に protobuf レスポンスを DTO にマッピングすること", async () => {
    expect.hasAssertions();
    mockResponse({
      result: Result.Success,
      tdkh: {
        key: "guide",
        title: "タイトル",
        description: "説明",
        keywords: "キーワード",
        h1: "見出し",
      },
    });

    const result = await getTdkh({ key: "guide" });

    expect(getTdkhMock).toHaveBeenCalledWith(
      { key: "guide" },
      expect.any(Metadata),
      expect.objectContaining({ deadline: anyDate }),
      expect.any(Function),
    );
    expect(result).toStrictEqual({
      tdkh: {
        key: "guide",
        title: "タイトル",
        description: "説明",
        keywords: "キーワード",
        h1: "見出し",
      },
    });
  });

  it("success でも tdkh が欠けている場合は空文字でフォールバックすること", async () => {
    expect.hasAssertions();
    mockResponse({ result: Result.Success });

    const result = await getTdkh({ key: "guide" });

    expect(result).toStrictEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });

  it("success 以外の場合に空の DTO を返すこと", async () => {
    expect.hasAssertions();
    mockResponse({ result: Result.NotFound });

    const result = await getTdkh({ key: "unknown" });

    expect(result).toStrictEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });

  it("通信エラーの場合に空の DTO を返すこと", async () => {
    expect.hasAssertions();
    const grpcError = new Error("UNAVAILABLE");
    getTdkhMock.mockImplementation((_request, _metadata, _options, callback) => {
      callback(grpcError);
    });

    await expect(getTdkh({ key: "guide" })).resolves.toStrictEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });
});

const anyDate: unknown = expect.any(Date);
