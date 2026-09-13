import "server-only";
import type { CallOptions } from "@grpc/grpc-js";

import { Metadata } from "@grpc/grpc-js";

type GrpcCallback<TRes> = (err: unknown, response?: TRes) => void;
type GrpcUnaryMethod<TReq, TRes> = (
  req: TReq,
  metadata: Metadata,
  options: CallOptions,
  callback: GrpcCallback<TRes>,
) => unknown;

// Grpc-client のコールバック API を Promise 化する。
// Client のメソッドは this に依存するため、bind 済みの関数を渡すこと。
// 例: callGrpc(client.getSuggestProjects.bind(client), req)
export const callGrpc = <TReq, TRes>(
  method: GrpcUnaryMethod<TReq, TRes>,
  req: TReq,
  options: CallOptions = {},
  metadata: Metadata = new Metadata(),
): Promise<TRes> =>
  // oxlint-disable-next-line promise/avoid-new -- gRPC のコールバック API を Promise に変換する境界。
  new Promise<TRes>((resolve, reject) => {
    method(req, metadata, options, (err, response) => {
      if (err != null || response === undefined) {
        // oxlint-disable-next-line typescript/prefer-promise-reject-errors -- gRPC のステータス情報を失わないよう元のエラーを呼び出し元へ渡す。
        reject(err ?? new Error("empty gRPC response"));
        return;
      }
      resolve(response);
    });
  });
