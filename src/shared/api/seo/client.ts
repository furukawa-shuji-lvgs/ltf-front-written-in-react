import "server-only";

import { SharedSeoClient } from "@generated/shared/seo.grpc-client.ts";
import { getEnv } from "@shared/lib/env.ts";
import { grpcCredentialOptions, grpcCredentials } from "@shared/lib/grpc/credentials.ts";

export const sharedSeoClient = new SharedSeoClient(
  getEnv().GRPC_HOST,
  grpcCredentials,
  grpcCredentialOptions,
);
