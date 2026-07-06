#!/usr/bin/env node
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "../..");

const parseArgs = (argv) => {
  const options = {
    protoDir: path.join(workspaceRoot, "ltf-front/proto"),
    stubDir: path.join(scriptDir, "stubs"),
    depsDir: path.join(workspaceRoot, "ltf-front"),
    port: Number(process.env.GRPC_MOCK_PORT ?? 60051),
    host: process.env.GRPC_MOCK_HOST ?? "0.0.0.0",
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[index + 1];

    if (key === "verbose") {
      options.verbose = true;
      continue;
    }

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    index += 1;

    if (key === "port") {
      options.port = Number(value);
    } else if (key in options) {
      options[key] =
        path.isAbsolute(value) || key === "host" ? value : path.resolve(process.cwd(), value);
    } else {
      throw new Error(`Unknown option --${key}`);
    }
  }

  return options;
};

const fileExists = (filePath) => fs.existsSync(filePath);

const resolveDependencyRequire = (depsDir) => {
  const packageJsonPath = path.join(depsDir, "package.json");
  if (!fileExists(packageJsonPath)) {
    throw new Error(`Cannot resolve dependencies: ${packageJsonPath} is missing`);
  }
  return createRequire(pathToFileURL(packageJsonPath));
};

const findProtoFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findProtoFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".proto") ? [entryPath] : [];
  });
};

const hasServiceDefinition = (filePath) =>
  /^service\s+\w+/m.test(fs.readFileSync(filePath, "utf8"));

const toCamelCase = (value) => value.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());

const toSnakeCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();

const lowerFirst = (value) => value.charAt(0).toLowerCase() + value.slice(1);

const normalizeResponseObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeResponseObject);
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.startsWith("__"))
      .map(([key, child]) => {
        const normalizedKey = key.includes("_") ? toCamelCase(key) : key;
        const normalizedValue =
          normalizedKey === "result" && typeof child === "string"
            ? resultNameToNumber(child)
            : child;
        return [normalizedKey, normalizeResponseObject(normalizedValue)];
      }),
  );
};

const resultNameToNumber = (value) => {
  const resultValues = {
    Unknown: 0,
    Success: 1,
    BadRequest: 2,
    NotFound: 3,
    Internal: 4,
  };
  return resultValues[value] ?? value;
};

const repeatedItemCount = 3;
const maxMessageDepth = 5;

const isProtobufMessage = (value) =>
  value?.format === "Protocol Buffer 3 DescriptorProto" && Array.isArray(value.type?.field);

const normalizeTypeName = (typeName) => typeName.replace(/^\./, "");

const createMessageRegistry = (packageDefinition) => {
  const registry = new Map();
  const simpleNames = new Map();

  for (const [key, value] of Object.entries(packageDefinition)) {
    if (!isProtobufMessage(value)) continue;

    const normalizedKey = normalizeTypeName(key);
    registry.set(normalizedKey, value.type);
    if (normalizedKey.startsWith("ltf.")) {
      registry.set(normalizedKey.slice("ltf.".length), value.type);
    }

    const simpleName = normalizedKey.split(".").at(-1);
    simpleNames.set(simpleName, simpleNames.has(simpleName) ? null : value.type);
  }

  return { registry, simpleNames };
};

const getServicePackage = (methodDefinition) => {
  const servicePath = methodDefinition?.path?.replace(/^\//, "").split("/").at(0) ?? "";
  return servicePath.split(".").slice(0, -1).join(".");
};

const resolveMessageType = (typeName, context, parentType) => {
  const normalizedTypeName = normalizeTypeName(typeName);
  const nestedType = parentType?.nestedType?.find((type) => type.name === normalizedTypeName);
  if (nestedType) return nestedType;

  const candidates = [
    normalizedTypeName,
    `${context.packageName}.${normalizedTypeName}`,
    `ltf.${normalizedTypeName}`,
  ];

  for (const candidate of candidates) {
    const descriptor = context.messageRegistry.registry.get(normalizeTypeName(candidate));
    if (descriptor) return descriptor;
  }

  for (const [key, descriptor] of context.messageRegistry.registry.entries()) {
    if (key.endsWith(`.${normalizedTypeName}`)) return descriptor;
  }

  return context.messageRegistry.simpleNames.get(normalizedTypeName) ?? null;
};

const fieldNameOf = (field) => field.jsonName || toCamelCase(field.name);

const sampleText = (fieldName, index) => {
  const normalized = fieldName.toLowerCase();
  const number = index + 1;

  if (normalized.includes("mail")) return "mock@example.com";
  if (normalized.includes("phone") || normalized.includes("tel")) return "03-1234-5678";
  if (
    normalized.includes("image") ||
    normalized.includes("thumbnail") ||
    normalized.includes("ogp")
  ) {
    return `https://placehold.jp/640x360.png?text=VRT+Mock+${number}`;
  }
  if (normalized.includes("url") || normalized.includes("uri") || normalized.includes("link")) {
    return `/project/detail/${1000 + number}/`;
  }
  if (normalized.includes("date")) return "2026-07-04";
  if (normalized.includes("station")) return "渋谷";
  if (normalized.includes("prefecture")) return "東京都";
  if (normalized.includes("skill"))
    return number === 1 ? "Java" : number === 2 ? "TypeScript" : "React";
  if (normalized.includes("jobtype") || normalized.includes("position"))
    return "サーバーサイドエンジニア";
  if (normalized.includes("category")) return number === 1 ? "Webサービス" : "業務システム";
  if (normalized.includes("title")) return `VRT用の詳細タイトル ${number}`;
  if (normalized.includes("subtitle")) return "画面確認用のサブタイトル";
  if (normalized.includes("description") || normalized.includes("meta")) {
    return "VRTで余白、折り返し、説明文エリアを確認するための十分な長さを持つモック説明文です。";
  }
  if (
    normalized.includes("content") ||
    normalized.includes("body") ||
    normalized.includes("html")
  ) {
    return "<p>VRT確認用の本文です。見出し、段落、一覧表示が崩れないことを確認できるよう、実画面に近い文章量を入れています。</p><h2>案件の特徴</h2><ul><li>リモート相談可</li><li>長期参画を想定</li><li>チーム開発</li></ul>";
  }
  if (normalized.includes("message") || normalized.includes("text")) {
    return "VRT確認用のテキストです。複数行になっても表示崩れが分かるように少し長めにしています。";
  }
  if (normalized.includes("name"))
    return number === 1 ? "Java開発支援" : number === 2 ? "TypeScript移行支援" : "React画面改善";
  if (normalized.includes("keyword")) return number === 1 ? "Java" : "リモート";
  if (normalized.includes("sip")) return "vrt-mock-sip";

  return `VRT Mock ${number}`;
};

const sampleNumber = (fieldName, index) => {
  const normalized = fieldName.toLowerCase();
  const number = index + 1;

  if (normalized === "id" || normalized.endsWith("id")) return 1000 + number;
  if (normalized.includes("count") || normalized.includes("total"))
    return normalized.includes("page") ? 3 : 42;
  if (normalized.includes("currentpage")) return 1;
  if (normalized.includes("itemsperpage")) return 20;
  if (
    normalized.includes("price") ||
    normalized.includes("payment") ||
    normalized.includes("income")
  ) {
    return 700000 + index * 100000;
  }
  if (normalized.includes("assess")) return 780000 + index * 50000;
  if (normalized.includes("year")) return index + 2;
  if (normalized.includes("day")) return index + 3;
  if (normalized.includes("month")) return 12;

  return number;
};

const sampleWrapperValue = (typeName, fieldName, index) => {
  const normalizedTypeName = normalizeTypeName(typeName);
  if (normalizedTypeName === "google.protobuf.StringValue")
    return { value: sampleText(fieldName, index) };
  if (
    normalizedTypeName === "google.protobuf.Int32Value" ||
    normalizedTypeName === "google.protobuf.UInt32Value" ||
    normalizedTypeName === "google.protobuf.Int64Value" ||
    normalizedTypeName === "google.protobuf.UInt64Value"
  ) {
    return { value: sampleNumber(fieldName, index) };
  }
  if (
    normalizedTypeName === "google.protobuf.DoubleValue" ||
    normalizedTypeName === "google.protobuf.FloatValue"
  ) {
    return { value: sampleNumber(fieldName, index) + 0.5 };
  }
  if (normalizedTypeName === "google.protobuf.BoolValue") return { value: true };

  return null;
};

const shouldSkipSuccessField = (fieldName) =>
  fieldName === "errors" || fieldName === "error" || fieldName === "failed";

const createScalarValue = (field, index) => {
  const fieldName = fieldNameOf(field);

  if (fieldName === "result") return 1;

  switch (field.type) {
    case "TYPE_BOOL":
      return !fieldName.toLowerCase().includes("closed");
    case "TYPE_DOUBLE":
    case "TYPE_FLOAT":
      return sampleNumber(fieldName, index) + 0.5;
    case "TYPE_INT64":
    case "TYPE_UINT64":
    case "TYPE_SINT64":
    case "TYPE_FIXED64":
    case "TYPE_SFIXED64":
      return String(sampleNumber(fieldName, index));
    case "TYPE_INT32":
    case "TYPE_UINT32":
    case "TYPE_SINT32":
    case "TYPE_FIXED32":
    case "TYPE_SFIXED32":
      return sampleNumber(fieldName, index);
    case "TYPE_ENUM":
      return 1;
    case "TYPE_STRING":
      return sampleText(fieldName, index);
    default:
      return null;
  }
};

const createFieldValue = (field, context, parentType, depth, index) => {
  const fieldName = fieldNameOf(field);
  if (shouldSkipSuccessField(fieldName)) return undefined;

  if (field.label === "LABEL_REPEATED") {
    if (fieldName === "errors") return [];
    return Array.from({ length: repeatedItemCount }, (_value, itemIndex) =>
      createSingleFieldValue(field, context, parentType, depth, itemIndex),
    ).filter((value) => value !== undefined);
  }

  return createSingleFieldValue(field, context, parentType, depth, index);
};

const createSingleFieldValue = (field, context, parentType, depth, index) => {
  const fieldName = fieldNameOf(field);
  if (field.type !== "TYPE_MESSAGE") return createScalarValue(field, index);

  const wrapperValue = sampleWrapperValue(field.typeName, fieldName, index);
  if (wrapperValue) return wrapperValue;

  const messageType = resolveMessageType(field.typeName, context, parentType);
  if (!messageType || depth >= maxMessageDepth) return {};

  return createMessageValue(messageType, context, depth + 1, index);
};

const createMessageValue = (messageType, context, depth = 0, index = 0) => {
  const response = {};

  for (const field of messageType.field ?? []) {
    const fieldName = fieldNameOf(field);
    const value = createFieldValue(field, context, messageType, depth, index);
    if (value === undefined) continue;
    response[fieldName] = value;
  }

  return response;
};

const createFallbackResponse = (methodDefinition, messageRegistry, request) => {
  const packageName = getServicePackage(methodDefinition);
  const responseType = methodDefinition?.responseType?.type;
  if (!responseType) {
    return {
      result: 1,
      __fallback: true,
      __request: request,
    };
  }

  return {
    ...createMessageValue(responseType, { messageRegistry, packageName }),
    __fallback: true,
    __request: request,
  };
};

class StubRepository {
  counters = new Map();

  constructor(stubDir) {
    this.stubDir = stubDir;
  }

  readService(serviceName) {
    const candidates = [
      serviceName,
      lowerFirst(serviceName),
      toSnakeCase(serviceName),
      serviceName.toLowerCase(),
    ].flatMap((name) => [path.join(this.stubDir, `${name}.json`), path.join(this.stubDir, name)]);

    const filePath = candidates.find(fileExists);
    if (!filePath) return null;

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  responseFor(serviceName, methodName, request) {
    const serviceStub = this.readService(serviceName);
    const methodCandidates = [
      methodName,
      lowerFirst(methodName),
      toCamelCase(methodName),
      toSnakeCase(methodName),
      methodName.toLowerCase(),
    ];

    const rawResponse = methodCandidates
      .map((name) => serviceStub?.[name])
      .find((response) => response !== undefined);

    if (rawResponse === undefined) return this.defaultResponse(serviceName, methodName, request);

    const selected = this.selectResponse(serviceName, methodName, rawResponse);
    if (typeof selected === "function") {
      return selected(request);
    }
    return selected;
  }

  selectResponse(serviceName, methodName, response) {
    if (!Array.isArray(response)) {
      return response;
    }

    const key = `${serviceName}.${methodName}`;
    const count = this.counters.get(key) ?? 0;
    this.counters.set(key, count + 1);
    return response[count % response.length];
  }

  defaultResponse(serviceName, methodName, _request) {
    const defaultStub = this.readService("__default");
    return defaultStub?.[`${serviceName}.${methodName}`] ?? defaultStub?.[methodName];
  }
}

const createServiceHandler = (
  serviceName,
  serviceDefinition,
  repository,
  messageRegistry,
  verbose,
) =>
  new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop !== "string") return undefined;

        return (call, callback) => {
          const request = call.request ?? {};
          const rawResponse =
            repository.responseFor(serviceName, prop, request) ??
            createFallbackResponse(serviceDefinition[prop], messageRegistry, request);
          if (verbose) {
            console.log(`[grpc-mock] ${serviceName}.${prop}`, JSON.stringify(request));
          }

          if (rawResponse?.__isError || rawResponse?.__error) {
            const error = new Error(rawResponse.message ?? `Mock error: ${serviceName}.${prop}`);
            error.code = rawResponse.code ?? 13;
            error.details = rawResponse.details ?? error.message;
            callback(error);
            return;
          }

          callback(null, normalizeResponseObject(rawResponse));
        };
      },
    },
  );

const isProtobufType = (value) =>
  value &&
  typeof value === "object" &&
  "format" in value &&
  "type" in value &&
  "fileDescriptorProtos" in value;

const isGrpcService = (value) => {
  if (
    !value ||
    (typeof value !== "object" && typeof value !== "function") ||
    !("service" in value)
  ) {
    return false;
  }

  const methods = Object.values(value.service ?? {});
  return (
    methods.length > 0 &&
    methods.every((method) => method?.path && method?.requestSerialize && method?.responseSerialize)
  );
};

const registerServices = (server, grpcObject, repository, messageRegistry, verbose) => {
  for (const [key, value] of Object.entries(grpcObject)) {
    if (isProtobufType(value)) continue;
    if (isGrpcService(value)) {
      console.log(`[grpc-mock] register ${key}`);
      server.addService(
        value.service,
        createServiceHandler(key, value.service, repository, messageRegistry, verbose),
      );
      continue;
    }
    if (value && typeof value === "object") {
      registerServices(server, value, repository, messageRegistry, verbose);
    }
  }
};

const collectWellKnownProtoDirs = (depsDir) => {
  const candidates = [
    path.join(depsDir, "node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ltf-front/node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ltcr-front/node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ownd-lp/node_modules/grpc-tools/bin"),
  ];

  return candidates.filter((dir) => fileExists(path.join(dir, "google/protobuf/wrappers.proto")));
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const requireFromDeps = resolveDependencyRequire(options.depsDir);
  const grpc = requireFromDeps("@grpc/grpc-js");
  const protoLoader = requireFromDeps("@grpc/proto-loader");

  const protoFiles = findProtoFiles(options.protoDir);
  const serviceProtoFiles = protoFiles.filter(hasServiceDefinition);
  if (serviceProtoFiles.length === 0) {
    throw new Error(`No service proto files found in ${options.protoDir}`);
  }

  const includeDirs = [options.protoDir, ...collectWellKnownProtoDirs(options.depsDir)];
  const packageDefinition = protoLoader.loadSync(serviceProtoFiles, {
    includeDirs,
    defaults: true,
    arrays: true,
    objects: true,
    longs: String,
    enums: Number,
    oneofs: true,
  });
  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const server = new grpc.Server();
  const repository = new StubRepository(options.stubDir);
  const messageRegistry = createMessageRegistry(packageDefinition);

  registerServices(server, grpcObject, repository, messageRegistry, options.verbose);

  const bindAddress = `${options.host}:${options.port}`;
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) throw error;
    console.log(`[grpc-mock] listening on ${bindAddress} (bound:${port})`);
    console.log(`[grpc-mock] protoDir=${options.protoDir}`);
    console.log(`[grpc-mock] stubDir=${options.stubDir}`);
  });
};

run().catch((error) => {
  console.error("[grpc-mock] failed to start");
  console.error(error);
  process.exitCode = 1;
});
