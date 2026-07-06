import "server-only";

import { credentials } from "@grpc/grpc-js";
import { getRuntimeEnv } from "../runtimeEnv.ts";

const usesInsecureGrpc =
  getRuntimeEnv("CUSTOM_ENV") === "development" || getRuntimeEnv("GRPC_MOCK_INSECURE") === "true";

export const grpcCredentials = usesInsecureGrpc
  ? credentials.createInsecure()
  : credentials.createSsl();

export const grpcCredentialOptions =
  !usesInsecureGrpc && getRuntimeEnv("CUSTOM_ENV") === "local"
    ? {
        // local から STG の BE に localhost ドメインで接続するので、SSL の判定は STG ドメイン側で行う必要がある
        "grpc.ssl_target_name_override": "*.levtech.org",
      }
    : {};
