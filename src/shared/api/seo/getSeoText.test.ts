import { Result } from "@generated/results/result.ts";
import type { GetSeoTextResponse } from "@generated/shared/seo.ts";
import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { getSeoTextMock } = vi.hoisted(() => ({
  getSeoTextMock: vi.fn(),
}));

vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn(() => ({
    getSeoText: getSeoTextMock,
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

import { getSeoText } from "./getSeoText.ts";

const mockResponse = (response: Partial<GetSeoTextResponse>) => {
  getSeoTextMock.mockImplementation((...args: unknown[]) => {
    const callback = args.at(-1) as (err: unknown, response?: Partial<GetSeoTextResponse>) => void;
    callback(null, response);
  });
};

describe("getSeoText", () => {
  beforeEach(() => {
    getSeoTextMock.mockReset();
  });

  test("Success の場合に StringValue を unwrap して DTO にマッピングすること", async () => {
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
      expect.objectContaining({ deadline: expect.any(Date) }),
      expect.any(Function),
    );
    expect(result).toEqual({
      seoText: {
        title: "タイトル",
        text: "本文",
        secondTitle: "第二タイトル",
        secondText: "第二本文",
      },
    });
  });

  test("Success でも seoText の項目が欠けている場合は undefined になること", async () => {
    mockResponse({ result: Result.Success, seoText: { title: { value: "タイトルのみ" } } });

    const result = await getSeoText({ relativeUrlPath: "/guide/" });

    expect(result).toEqual({
      seoText: {
        title: "タイトルのみ",
        text: undefined,
        secondTitle: undefined,
        secondText: undefined,
      },
    });
  });

  test("Success 以外の場合に空の DTO を返すこと", async () => {
    mockResponse({ result: Result.NotFound });

    const result = await getSeoText({ relativeUrlPath: "/unknown/" });

    expect(result).toEqual({ seoText: {} });
  });

  test("通信エラーの場合に空の DTO を返すこと", async () => {
    const grpcError = new Error("UNAVAILABLE");
    getSeoTextMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (err: unknown) => void;
      callback(grpcError);
    });

    await expect(getSeoText({ relativeUrlPath: "/guide/" })).resolves.toEqual({ seoText: {} });
  });
});
