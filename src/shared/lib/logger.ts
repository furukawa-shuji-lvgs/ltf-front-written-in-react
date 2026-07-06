/**
 * 簡易ロガー
 *
 * 移行メモ: 移行元の @lv-levtech/pino は internal-libs/fusion/pino の PinoInitializer を使う。
 * ltf-react では同じ呼び出しシグネチャ（`logger.warn(obj, msg)` / `logger.warn(msg)`）を保った
 * console ベース実装にして、Vercel/Next の標準出力へJSONログを流す。
 */

import { getRuntimeEnv } from "./runtimeEnv.ts";

type LogPayload = Record<string, unknown>;
type LogInput = LogPayload | Error | string;
type LogMethod = (objOrMessage: LogInput, message?: string) => void;
type LogLevel = "info" | "warn" | "error";

export interface Logger {
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

export interface LoggerOptions {
  requestId?: string;
}

const logLevelPriority = {
  info: 20,
  warn: 30,
  error: 40,
} as const satisfies Record<LogLevel, number>;

const hostName = getRuntimeEnv("HOSTNAME") ?? "unknown";

const configuredLogLevel = (): LogLevel => {
  const rawLevel = getRuntimeEnv("LOG_LEVEL")?.toLowerCase();
  return rawLevel === "warn" || rawLevel === "error" ? rawLevel : "info";
};

const isEnabled = (level: LogLevel): boolean =>
  logLevelPriority[level] >= logLevelPriority[configuredLogLevel()];

const serializeError = (error: Error) => ({
  name: error.name,
  message: error.message,
  ...(error.stack === undefined ? {} : { stack: error.stack }),
});

const serializeLog = (
  level: LogLevel,
  name: string,
  options: LoggerOptions | undefined,
  objOrMessage: LogInput,
  message?: string,
) => {
  const payload =
    objOrMessage instanceof Error
      ? { err: serializeError(objOrMessage) }
      : typeof objOrMessage === "string"
        ? {}
        : objOrMessage;

  return JSON.stringify({
    level: level.toUpperCase(),
    time: new Date().toISOString(),
    pid: process.pid,
    hostname: hostName,
    name,
    msg: typeof objOrMessage === "string" ? objOrMessage : (message ?? ""),
    ...(options?.requestId === undefined ? {} : { requestId: options.requestId }),
    ...payload,
  });
};

const log =
  (
    level: LogLevel,
    output: (...args: unknown[]) => void,
    name: string,
    options?: LoggerOptions,
  ): LogMethod =>
  (objOrMessage, message) => {
    if (!isEnabled(level)) return;
    output(serializeLog(level, name, options, objOrMessage, message));
  };

export const getLogger = (name: string, options?: LoggerOptions): Logger => ({
  info: log("info", console.info, name, options),
  warn: log("warn", console.warn, name, options),
  error: log("error", console.error, name, options),
});
