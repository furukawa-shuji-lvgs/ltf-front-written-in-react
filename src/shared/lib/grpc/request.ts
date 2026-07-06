import "server-only";

import { Result } from "@generated/results/result.ts";
import { type CallOptions, Metadata, status } from "@grpc/grpc-js";
import { getLogger } from "@shared/lib/logger.ts";
import { callGrpc } from "./call.ts";

type GrpcCallback<TRes> = (err: unknown, response?: TRes) => void;
type GrpcUnaryMethod<TReq, TRes> = (
  req: TReq,
  metadata: Metadata,
  options: CallOptions,
  callback: GrpcCallback<TRes>,
) => unknown;

interface GrpcRetryConfig {
  maxAttempts?: number;
  retryableCodes?: readonly number[];
}

interface GrpcRequestConfig<TReq, TRes, TDto> {
  name: string;
  method: GrpcUnaryMethod<TReq, TRes>;
  request: TReq;
  fallback: TDto;
  mapResponse: (response: TRes) => TDto;
  isSuccessful?: (response: TRes) => boolean;
  timeoutMs?: number;
  metadata?: Metadata;
  requestId?: string;
  retry?: GrpcRetryConfig;
}

const DEFAULT_GRPC_TIMEOUT_MS = 3_000;
const DEFAULT_MAX_ATTEMPTS = 2;
const DEFAULT_RETRYABLE_CODES = [status.UNAVAILABLE, status.DEADLINE_EXCEEDED] as const;
const requestIdMetadataKey = "x-request-id";
const logger = getLogger("grpc");

const normalizeGrpcError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const errorWithCode = error as Error & { code?: unknown };

  return {
    name: error.name,
    message: error.message,
    ...(typeof errorWithCode.code === "number" ? { code: errorWithCode.code } : {}),
  };
};

const grpcErrorCode = (error: unknown): number | undefined => {
  if (!(error instanceof Error)) return undefined;

  const errorWithCode = error as Error & { code?: unknown };
  return typeof errorWithCode.code === "number" ? errorWithCode.code : undefined;
};

const shouldRetryGrpcError = (error: unknown, retryableCodes: readonly number[]): boolean => {
  const code = grpcErrorCode(error);
  return code !== undefined && retryableCodes.includes(code);
};

export const buildGrpcMetadata = ({
  metadata,
  requestId,
}: {
  metadata?: Metadata;
  requestId?: string;
}): Metadata => {
  const nextMetadata = metadata?.clone() ?? new Metadata();

  if (requestId && nextMetadata.get(requestIdMetadataKey).length === 0) {
    nextMetadata.set(requestIdMetadataKey, requestId);
  }

  return nextMetadata;
};

export const isGrpcResultSuccess = <TResponse extends { result?: Result }>(
  response: TResponse,
): boolean => response.result === Result.Success;

export const callGrpcRequest = async <TReq, TRes, TDto>({
  name,
  method,
  request,
  fallback,
  mapResponse,
  isSuccessful = () => true,
  timeoutMs = DEFAULT_GRPC_TIMEOUT_MS,
  metadata,
  requestId,
  retry,
}: GrpcRequestConfig<TReq, TRes, TDto>): Promise<TDto> => {
  const maxAttempts = Math.max(1, retry?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  const retryableCodes = retry?.retryableCodes ?? DEFAULT_RETRYABLE_CODES;
  const grpcMetadata = buildGrpcMetadata({
    ...(metadata === undefined ? {} : { metadata }),
    ...(requestId === undefined ? {} : { requestId }),
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await callGrpc(
        method,
        request,
        {
          deadline: new Date(Date.now() + timeoutMs),
        },
        grpcMetadata,
      );

      if (!isSuccessful(response)) {
        logger.warn({ rpc: name, response }, "gRPC response was not successful.");
        return fallback;
      }

      return mapResponse(response);
    } catch (error) {
      const canRetry = attempt < maxAttempts && shouldRetryGrpcError(error, retryableCodes);
      const normalizedError = normalizeGrpcError(error);

      if (canRetry) {
        logger.warn(
          { rpc: name, attempt, maxAttempts, error: normalizedError },
          "gRPC request retrying.",
        );
        continue;
      }

      logger.warn({ rpc: name, attempt, error: normalizedError }, "gRPC request failed.");
      return fallback;
    }
  }

  return fallback;
};
