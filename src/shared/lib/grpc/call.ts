import "server-only";

import { type CallOptions, Metadata } from "@grpc/grpc-js";

type GrpcCallback<TRes> = (err: unknown, response?: TRes) => void;
type GrpcUnaryMethod<TReq, TRes> = (
  req: TReq,
  metadata: Metadata,
  options: CallOptions,
  callback: GrpcCallback<TRes>,
) => unknown;

// grpc-client のコールバック API を Promise 化する。
// client のメソッドは this に依存するため、bind 済みの関数を渡すこと。
// 例: callGrpc(client.getSuggestProjects.bind(client), req)
export const callGrpc = <TReq, TRes>(
  method: GrpcUnaryMethod<TReq, TRes>,
  req: TReq,
  options: CallOptions = {},
  metadata: Metadata = new Metadata(),
): Promise<TRes> =>
  new Promise<TRes>((resolve, reject) => {
    method(req, metadata, options, (err, response) => {
      if (err || response === undefined) {
        return reject(err ?? new Error("empty gRPC response"));
      }
      return resolve(response);
    });
  });
