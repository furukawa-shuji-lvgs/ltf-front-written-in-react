import { trackError } from "@shared/lib/errorTracking.ts";

let processErrorHandlersRegistered = false;

const messageFrom = (fallback: string, cause: unknown): string =>
  cause instanceof Error && cause.message ? cause.message : fallback;

export const register = () => {
  // biome-ignore lint/style/noProcessEnv: Next.js instrumentation exposes runtime via NEXT_RUNTIME.
  if (process.env.NEXT_RUNTIME !== "nodejs" || processErrorHandlersRegistered) {
    return;
  }

  processErrorHandlersRegistered = true;

  process.on("uncaughtExceptionMonitor", (error) => {
    trackError({
      source: "server",
      message: messageFrom("Uncaught exception", error),
      cause: error,
      context: { lifecycle: "uncaughtExceptionMonitor" },
    });
  });

  process.on("unhandledRejection", (reason) => {
    trackError({
      source: "server",
      message: messageFrom("Unhandled promise rejection", reason),
      cause: reason,
      context: { lifecycle: "unhandledRejection" },
    });
  });
};
