import "server-only";
import type { Logger } from "@shared/lib/logger.ts";

import { getLogger } from "@shared/lib/logger.ts";

const fallbackMessage = "Unknown error";

type ErrorTrackingSource = "client" | "server";

type ErrorTrackingContext = Readonly<Record<string, string>>;

export interface ErrorTrackingEvent {
  readonly source: ErrorTrackingSource;
  readonly message: string;
  readonly digest?: string;
  readonly path?: string;
  readonly userAgent?: string;
  readonly cause?: unknown;
  readonly context?: ErrorTrackingContext;
}

type SerializedCause = {
  readonly name?: string;
  readonly message: string;
  readonly stack?: string;
};

export type ErrorTrackingPayload = Omit<ErrorTrackingEvent, "cause"> & {
  readonly cause?: SerializedCause;
};

const serializeCause = (cause: unknown): SerializedCause | undefined => {
  if (cause === undefined || cause === null) {
    return undefined;
  }
  if (cause instanceof Error) {
    return {
      name: cause.name,
      message: cause.message || fallbackMessage,
      ...(cause.stack === undefined ? {} : { stack: cause.stack }),
    };
  }
  if (typeof cause === "string") {
    return { message: cause };
  }

  return { message: JSON.stringify(cause) };
};

export const buildErrorTrackingPayload = ({
  source,
  message,
  digest,
  path,
  userAgent,
  cause,
  context,
}: ErrorTrackingEvent): ErrorTrackingPayload => {
  const serializedCause = serializeCause(cause);

  return {
    source,
    message: message || fallbackMessage,
    ...(digest === undefined ? {} : { digest }),
    ...(path === undefined ? {} : { path }),
    ...(userAgent === undefined ? {} : { userAgent }),
    ...(serializedCause === undefined ? {} : { cause: serializedCause }),
    ...(context === undefined ? {} : { context }),
  };
};

export const trackError = (
  event: ErrorTrackingEvent,
  logger: Logger = getLogger("error-tracking"),
): void => {
  logger.error({ error: buildErrorTrackingPayload(event) }, "Application error tracked.");
};
