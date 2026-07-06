import { Result } from "@generated/results/result.ts";
import type { GetTdkhResponse } from "@generated/shared/seo.ts";
import { Metadata } from "@grpc/grpc-js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { getTdkhMock } = vi.hoisted(() => ({
  getTdkhMock: vi.fn(),
}));

vi.mock("@generated/shared/seo.grpc-client", () => ({
  SharedSeoClient: vi.fn(() => ({
    getTdkh: getTdkhMock,
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

import { getTdkh } from "./getTdkh.ts";

const mockResponse = (response: Partial<GetTdkhResponse>) => {
  getTdkhMock.mockImplementation((...args: unknown[]) => {
    const callback = args.at(-1) as (err: unknown, response?: Partial<GetTdkhResponse>) => void;
    callback(null, response);
  });
};

describe("getTdkh", () => {
  beforeEach(() => {
    getTdkhMock.mockReset();
  });

  test("Success の場合に protobuf レスポンスを DTO にマッピングすること", async () => {
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
      expect.objectContaining({ deadline: expect.any(Date) }),
      expect.any(Function),
    );
    expect(result).toEqual({
      tdkh: {
        key: "guide",
        title: "タイトル",
        description: "説明",
        keywords: "キーワード",
        h1: "見出し",
      },
    });
  });

  test("Success でも tdkh が欠けている場合は空文字でフォールバックすること", async () => {
    mockResponse({ result: Result.Success });

    const result = await getTdkh({ key: "guide" });

    expect(result).toEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });

  test("Success 以外の場合に空の DTO を返すこと", async () => {
    mockResponse({ result: Result.NotFound });

    const result = await getTdkh({ key: "unknown" });

    expect(result).toEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });

  test("通信エラーの場合に空の DTO を返すこと", async () => {
    const grpcError = new Error("UNAVAILABLE");
    getTdkhMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (err: unknown) => void;
      callback(grpcError);
    });

    await expect(getTdkh({ key: "guide" })).resolves.toEqual({
      tdkh: { key: "", title: "", description: "", keywords: "", h1: "" },
    });
  });
});
