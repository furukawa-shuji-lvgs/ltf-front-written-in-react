import { Result } from "@generated/results/result.ts";
import { Metadata, status } from "@grpc/grpc-js";
import { describe, expect, it, vi } from "vitest";
import { buildGrpcMetadata, callGrpcRequest, isGrpcResultSuccess } from "./request.ts";

const { warnMock } = vi.hoisted(() => ({
  warnMock: vi.fn(),
}));

vi.mock("@shared/lib/logger", () => ({
  getLogger: vi.fn(() => ({
    warn: warnMock,
  })),
}));

type TestRequest = {
  key: string;
};

type TestResponse = {
  result: Result;
  value?: string;
};

describe("gRPC Request Adapter > Unary API > 経路", () => {
  it("成功レスポンス / 検証: DTO変換 / 期待: metadataとdeadline付きで呼び出して変換結果を返す", async () => {
    // Arrange
    const method = vi.fn((_req, _metadata, _options, callback) => {
      callback(null, { result: Result.Success, value: "ok" });
    });

    // Act
    const result = await callGrpcRequest<TestRequest, TestResponse, { value: string }>({
      name: "test.get",
      method,
      request: { key: "route" },
      fallback: { value: "" },
      isSuccessful: isGrpcResultSuccess,
      requestId: "request-id-1",
      mapResponse: (response) => ({ value: response.value ?? "" }),
    });

    // Assert
    expect(method).toHaveBeenCalledWith(
      { key: "route" },
      expect.any(Metadata),
      expect.objectContaining({ deadline: expect.any(Date) }),
      expect.any(Function),
    );
    expect(method.mock.calls[0]?.[1].get("x-request-id")).toEqual(["request-id-1"]);
    expect(result).toEqual({ value: "ok" });
  });

  it("失敗result / 検証: fallback / 期待: fallbackを返してwarnログを出す", async () => {
    // Arrange
    const method = vi.fn((_req, _metadata, _options, callback) => {
      callback(null, { result: Result.NotFound });
    });

    // Act
    const result = await callGrpcRequest<TestRequest, TestResponse, { value: string }>({
      name: "test.get",
      method,
      request: { key: "missing" },
      fallback: { value: "" },
      isSuccessful: isGrpcResultSuccess,
      mapResponse: (response) => ({ value: response.value ?? "" }),
    });

    // Assert
    expect(result).toEqual({ value: "" });
    expect(warnMock).toHaveBeenCalledWith(
      { rpc: "test.get", response: { result: Result.NotFound } },
      "gRPC response was not successful.",
    );
  });

  it("通信エラー / 検証: fallback / 期待: fallbackを返してエラー内容を記録する", async () => {
    // Arrange
    const method = vi.fn((_req, _metadata, _options, callback) => {
      callback(new Error("UNAVAILABLE"));
    });

    // Act
    const result = await callGrpcRequest<TestRequest, TestResponse, { value: string }>({
      name: "test.get",
      method,
      request: { key: "route" },
      fallback: { value: "" },
      isSuccessful: isGrpcResultSuccess,
      mapResponse: (response) => ({ value: response.value ?? "" }),
    });

    // Assert
    expect(result).toEqual({ value: "" });
    expect(warnMock).toHaveBeenCalledWith(
      {
        rpc: "test.get",
        attempt: 1,
        error: { name: "Error", message: "UNAVAILABLE" },
      },
      "gRPC request failed.",
    );
  });

  it("一時的な通信エラー / 検証: retry / 期待: retry後の成功レスポンスを返す", async () => {
    // Arrange
    const grpcError = Object.assign(new Error("UNAVAILABLE"), { code: status.UNAVAILABLE });
    const method = vi
      .fn()
      .mockImplementationOnce((_req, _metadata, _options, callback) => {
        callback(grpcError);
      })
      .mockImplementationOnce((_req, _metadata, _options, callback) => {
        callback(null, { result: Result.Success, value: "ok-after-retry" });
      });

    // Act
    const result = await callGrpcRequest<TestRequest, TestResponse, { value: string }>({
      name: "test.get",
      method,
      request: { key: "route" },
      fallback: { value: "" },
      isSuccessful: isGrpcResultSuccess,
      mapResponse: (response) => ({ value: response.value ?? "" }),
    });

    // Assert
    expect(method).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ value: "ok-after-retry" });
    expect(warnMock).toHaveBeenCalledWith(
      {
        rpc: "test.get",
        attempt: 1,
        maxAttempts: 2,
        error: { name: "Error", message: "UNAVAILABLE", code: status.UNAVAILABLE },
      },
      "gRPC request retrying.",
    );
  });
});

describe("gRPC Request Adapter > Metadata > 経路", () => {
  it("既存metadata / 検証: request id / 期待: 既存値を維持してrequest idを追加する", () => {
    // Arrange
    const metadata = new Metadata();
    metadata.set("x-user-segment", "internal");

    // Act
    const result = buildGrpcMetadata({ metadata, requestId: "request-id-1" });

    // Assert
    expect(result.get("x-user-segment")).toEqual(["internal"]);
    expect(result.get("x-request-id")).toEqual(["request-id-1"]);
    expect(metadata.get("x-request-id")).toEqual([]);
  });
});
