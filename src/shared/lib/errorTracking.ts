import "server-only";

import { getLogger, type Logger } from "@shared/lib/logger.ts";

type ErrorTrackingSource = "client" | "server";

type ErrorTrackingContext = Record<string, string>;

export interface ErrorTrackingEvent {
  source: ErrorTrackingSource;
  message: string;
  digest?: string;
  path?: string;
  userAgent?: string;
  cause?: unknown;
  context?: ErrorTrackingContext;
}

type SerializedCause = {
  name?: string;
  message: string;
  stack?: string;
};

export type ErrorTrackingPayload = Omit<ErrorTrackingEvent, "cause"> & {
  cause?: SerializedCause;
};

const fallbackMessage = "Unknown error";

const serializeCause = (cause: unknown): SerializedCause | undefined => {
  if (cause === undefined || cause === null) return undefined;
  if (cause instanceof Error) {
    return {
      name: cause.name,
      message: cause.message || fallbackMessage,
      ...(cause.stack === undefined ? {} : { stack: cause.stack }),
    };
  }
  if (typeof cause === "string") return { message: cause };

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
