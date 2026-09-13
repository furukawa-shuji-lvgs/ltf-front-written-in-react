#!/usr/bin/env node
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { sampleText, sampleNumber } from "./samples.mjs";
import {
  errorSchema,
  messageDefinitionSchema,
  responseDefinitionSchema,
  stubSchema,
} from "./schemas.mjs";

/** @typedef {import("zod").infer<typeof import("./schemas.mjs").fieldSchema>} Field */
/** @typedef {import("zod").infer<typeof import("./schemas.mjs").messageSchema>} Message */
/** @typedef {{ registry: Map<string, Message>; simpleNames: Map<string, Message | null> }} MessageRegistry */
/** @typedef {{ messageRegistry: MessageRegistry; packageName: string }} MessageContext */
/** @typedef {import("@grpc/grpc-js").ServiceDefinition} ServiceDefinition */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const scriptDir = import.meta.dirname;
const workspaceRoot = path.resolve(scriptDir, "../..");

/** @param {readonly string[]} argv */
const parseArgs = (argv) => {
  const options = {
    protoDir: path.join(workspaceRoot, "ltf-front/proto"),
    stubDir: path.join(scriptDir, "stubs"),
    depsDir: path.join(workspaceRoot, "ltf-front"),
    port: Number(process.env.GRPC_MOCK_PORT ?? 60_051),
    host: process.env.GRPC_MOCK_HOST ?? "0.0.0.0",
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined || !arg.startsWith("--")) {
      continue;
    }
    const key = arg.slice(2);
    const value = argv[index + 1];

    if (key === "verbose") {
      options.verbose = true;
      continue;
    }

    if (!(value != null && value !== "") || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    index += 1;

    if (key === "port") {
      options.port = Number(value);
    } else if (key === "protoDir" || key === "stubDir" || key === "depsDir" || key === "host") {
      options[key] =
        path.isAbsolute(value) || key === "host" ? value : path.resolve(process.cwd(), value);
    } else {
      throw new Error(`Unknown option --${key}`);
    }
  }

  return options;
};

/** @param {string} filePath */
const fileExists = (filePath) => fs.existsSync(filePath);

/** @param {string} depsDir */
const resolveDependencyRequire = (depsDir) => {
  const packageJsonPath = path.join(depsDir, "package.json");
  if (!fileExists(packageJsonPath)) {
    throw new Error(`Cannot resolve dependencies: ${packageJsonPath} is missing`);
  }
  return createRequire(pathToFileURL(packageJsonPath));
};

/**
 * @param {string} dir
 * @returns {string[]}
 */
const findProtoFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return findProtoFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith(".proto") ? [entryPath] : [];
  });
};

/** @param {string} filePath */
const hasServiceDefinition = (filePath) =>
  /^service\s+\w+/mu.test(fs.readFileSync(filePath, "utf8"));

/** @param {string} value */
const toCamelCase = (value) =>
  value.replaceAll(/_(?<lowercase>[a-z0-9])/gu, (_match, /** @type {string} */ char) =>
    char.toUpperCase(),
  );

/** @param {string} value */
const toSnakeCase = (value) =>
  value
    .replaceAll(/(?<lowercase>[a-z0-9])(?<uppercase>[A-Z])/gu, "$1_$2")
    .replaceAll(/[-\s]+/gu, "_")
    .toLowerCase();

/** @param {string} value */
const lowerFirst = (value) => value.charAt(0).toLowerCase() + value.slice(1);

/**
 * @param {unknown} value
 * @returns {unknown}
 */
const normalizeResponseObject = (value) => {
  if (Array.isArray(value)) {
    /** @type {unknown[]} */
    const items = value;
    return items.map((item) => normalizeResponseObject(item));
  }
  if (!isRecord(value)) {
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

/** @param {string} value */
const resultNameToNumber = (value) => {
  /** @type {Record<string, number>} */
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

/** @param {string} typeName */
const normalizeTypeName = (typeName) => typeName.replace(/^\./u, "");

/**
 * @param {import("@grpc/proto-loader").PackageDefinition} packageDefinition
 * @returns {MessageRegistry}
 */
const createMessageRegistry = (packageDefinition) => {
  /** @type {Map<string, Message>} */
  const registry = new Map();
  /** @type {Map<string, Message | null>} */
  const simpleNames = new Map();

  for (const [key, value] of Object.entries(packageDefinition)) {
    const parsed = messageDefinitionSchema.safeParse(value);
    if (!parsed.success) {
      continue;
    }

    const normalizedKey = normalizeTypeName(key);
    registry.set(normalizedKey, parsed.data.type);
    if (normalizedKey.startsWith("ltf.")) {
      registry.set(normalizedKey.slice("ltf.".length), parsed.data.type);
    }

    const simpleName = normalizedKey.split(".").at(-1) ?? normalizedKey;
    simpleNames.set(simpleName, simpleNames.has(simpleName) ? null : parsed.data.type);
  }

  return { registry, simpleNames };
};

/** @param {ServiceDefinition[string] | undefined} methodDefinition */
const getServicePackage = (methodDefinition) => {
  const servicePath = methodDefinition?.path?.replace(/^\//u, "").split("/").at(0) ?? "";
  return servicePath.split(".").slice(0, -1).join(".");
};

/**
 * @param {string} typeName
 * @param {MessageContext} context
 * @param {Message} parentType
 */
const resolveMessageType = (typeName, context, parentType) => {
  const normalizedTypeName = normalizeTypeName(typeName);
  const nestedType = parentType?.nestedType?.find((type) => type.name === normalizedTypeName);
  if (nestedType) {
    return nestedType;
  }

  const candidates = [
    normalizedTypeName,
    `${context.packageName}.${normalizedTypeName}`,
    `ltf.${normalizedTypeName}`,
  ];

  for (const candidate of candidates) {
    const descriptor = context.messageRegistry.registry.get(normalizeTypeName(candidate));
    if (descriptor) {
      return descriptor;
    }
  }

  for (const [key, descriptor] of context.messageRegistry.registry.entries()) {
    if (key.endsWith(`.${normalizedTypeName}`)) {
      return descriptor;
    }
  }

  return context.messageRegistry.simpleNames.get(normalizedTypeName) ?? null;
};

/** @param {Field} field */
const fieldNameOf = (field) =>
  field.jsonName === undefined || field.jsonName === "" ? toCamelCase(field.name) : field.jsonName;

/**
 * @param {string} typeName
 * @param {string} fieldName
 * @param {number} index
 */
const sampleWrapperValue = (typeName, fieldName, index) => {
  const normalizedTypeName = normalizeTypeName(typeName);
  if (normalizedTypeName === "google.protobuf.StringValue") {
    return { value: sampleText(fieldName, index) };
  }
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
  if (normalizedTypeName === "google.protobuf.BoolValue") {
    return { value: true };
  }

  return null;
};

/** @param {string} fieldName */
const shouldSkipSuccessField = (fieldName) =>
  fieldName === "errors" || fieldName === "error" || fieldName === "failed";

/**
 * @param {Field} field
 * @param {number} index
 */
const createScalarValue = (field, index) => {
  const fieldName = fieldNameOf(field);

  if (fieldName === "result") {
    return 1;
  }

  switch (field.type) {
    case "TYPE_BOOL": {
      return !fieldName.toLowerCase().includes("closed");
    }
    case "TYPE_DOUBLE":
    case "TYPE_FLOAT": {
      return sampleNumber(fieldName, index) + 0.5;
    }
    case "TYPE_INT64":
    case "TYPE_UINT64":
    case "TYPE_SINT64":
    case "TYPE_FIXED64":
    case "TYPE_SFIXED64": {
      return String(sampleNumber(fieldName, index));
    }
    case "TYPE_INT32":
    case "TYPE_UINT32":
    case "TYPE_SINT32":
    case "TYPE_FIXED32":
    case "TYPE_SFIXED32": {
      return sampleNumber(fieldName, index);
    }
    case "TYPE_ENUM": {
      return 1;
    }
    case "TYPE_STRING": {
      return sampleText(fieldName, index);
    }
    default: {
      return null;
    }
  }
};

/**
 * @param {Field} field
 * @param {MessageContext} context
 * @param {Message} parentType
 * @param {number} depth
 * @param {number} index
 * @returns {unknown}
 */
const createFieldValue = (field, context, parentType, depth, index) => {
  const fieldName = fieldNameOf(field);
  if (shouldSkipSuccessField(fieldName)) {
    return;
  }

  if (field.label === "LABEL_REPEATED") {
    if (fieldName === "errors") {
      return [];
    }
    return Array.from({ length: repeatedItemCount }, (_value, itemIndex) =>
      createSingleFieldValue(field, context, parentType, depth, itemIndex),
    ).filter((value) => value !== undefined);
  }

  return createSingleFieldValue(field, context, parentType, depth, index);
};

/**
 * @param {Field} field
 * @param {MessageContext} context
 * @param {Message} parentType
 * @param {number} depth
 * @param {number} index
 * @returns {unknown}
 */
const createSingleFieldValue = (field, context, parentType, depth, index) => {
  const fieldName = fieldNameOf(field);
  if (field.type !== "TYPE_MESSAGE") {
    return createScalarValue(field, index);
  }

  const wrapperValue = sampleWrapperValue(field.typeName, fieldName, index);
  if (wrapperValue) {
    return wrapperValue;
  }

  const messageType = resolveMessageType(field.typeName, context, parentType);
  if (!messageType || depth >= maxMessageDepth) {
    return {};
  }

  return createMessageValue(messageType, context, depth + 1, index);
};

/**
 * @param {Message} messageType
 * @param {MessageContext} context
 * @param {number} [depth]
 * @param {number} [index]
 * @returns {Record<string, unknown>}
 */
const createMessageValue = (messageType, context, depth = 0, index = 0) => {
  /** @type {Record<string, unknown>} */
  const response = {};

  for (const field of messageType.field ?? []) {
    const fieldName = fieldNameOf(field);
    const value = createFieldValue(field, context, messageType, depth, index);
    if (value === undefined) {
      continue;
    }
    response[fieldName] = value;
  }

  return response;
};

/**
 * @param {ServiceDefinition[string] | undefined} methodDefinition
 * @param {MessageRegistry} messageRegistry
 * @param {unknown} request
 */
const createFallbackResponse = (methodDefinition, messageRegistry, request) => {
  const packageName = getServicePackage(methodDefinition);
  const parsed = responseDefinitionSchema.safeParse(methodDefinition);
  const responseType = parsed.success ? parsed.data.responseType.type : undefined;
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
  /** @type {Map<string, number>} */
  counters = new Map();

  /** @param {string} stubDir */
  constructor(stubDir) {
    this.stubDir = stubDir;
  }

  /** @param {string} serviceName */
  readService(serviceName) {
    const candidates = [
      serviceName,
      lowerFirst(serviceName),
      toSnakeCase(serviceName),
      serviceName.toLowerCase(),
    ].flatMap((name) => [path.join(this.stubDir, `${name}.json`), path.join(this.stubDir, name)]);

    const filePath = candidates.find((file) => fileExists(file));
    if (!(filePath != null && filePath !== "")) {
      return null;
    }

    return stubSchema.parse(JSON.parse(fs.readFileSync(filePath, "utf8")));
  }

  /**
   * @param {string} serviceName
   * @param {string} methodName
   * @param {unknown} request
   */
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

    if (rawResponse === undefined) {
      return this.defaultResponse(serviceName, methodName, request);
    }

    const selected = this.selectResponse(serviceName, methodName, rawResponse);
    return selected;
  }

  /**
   * @param {string} serviceName
   * @param {string} methodName
   * @param {unknown} response
   */
  selectResponse(serviceName, methodName, response) {
    if (!Array.isArray(response)) {
      return response;
    }

    const key = `${serviceName}.${methodName}`;
    const count = this.counters.get(key) ?? 0;
    this.counters.set(key, count + 1);
    /** @type {unknown[]} */
    const responses = response;
    return responses[count % responses.length];
  }

  /**
   * @param {string} serviceName
   * @param {string} methodName
   * @param {unknown} _request
   */
  defaultResponse(serviceName, methodName, _request) {
    const defaultStub = this.readService("__default");
    return defaultStub?.[`${serviceName}.${methodName}`] ?? defaultStub?.[methodName];
  }
}

/**
 * @param {string} serviceName
 * @param {ServiceDefinition} serviceDefinition
 * @param {StubRepository} repository
 * @param {MessageRegistry} messageRegistry
 * @param {boolean} verbose
 * @returns {import("@grpc/grpc-js").UntypedServiceImplementation}
 */
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
        if (typeof prop !== "string") {
          return;
        }

        /**
         * @param {import("@grpc/grpc-js").ServerUnaryCall<unknown, unknown>} call
         * @param {import("@grpc/grpc-js").sendUnaryData<unknown>} callback
         */
        const handleCall = (call, callback) => {
          const request = call.request ?? {};
          const rawResponse =
            repository.responseFor(serviceName, prop, request) ??
            createFallbackResponse(serviceDefinition[prop], messageRegistry, request);
          if (verbose) {
            console.log(`[grpc-mock] ${serviceName}.${prop}`, JSON.stringify(request));
          }

          const parsedError = errorSchema.safeParse(rawResponse);
          if (
            parsedError.success &&
            (parsedError.data.__isError === true || Boolean(parsedError.data.__error))
          ) {
            const mockError = parsedError.data;
            const message = mockError.message ?? `Mock error: ${serviceName}.${prop}`;
            const error = Object.assign(new Error(message), {
              code: mockError.code ?? 13,
              details: mockError.details ?? message,
            });
            callback(error);
            return;
          }

          callback(null, normalizeResponseObject(rawResponse));
        };
        return handleCall;
      },
    },
  );

/** @param {unknown} value */
const isProtobufType = (value) =>
  value !== null &&
  typeof value === "object" &&
  "format" in value &&
  "type" in value &&
  "fileDescriptorProtos" in value;

/**
 * @param {unknown} value
 * @returns {value is import("@grpc/grpc-js").ServiceClientConstructor}
 */
const isGrpcService = (value) => {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    !("service" in value)
  ) {
    return false;
  }

  if (value.service === null || typeof value.service !== "object") {
    return false;
  }
  /** @type {unknown[]} */
  const methods = Object.values(value.service);
  return (
    methods.length > 0 &&
    methods.every(
      (method) =>
        method !== null &&
        typeof method === "object" &&
        "path" in method &&
        typeof method.path === "string" &&
        "requestSerialize" in method &&
        typeof method.requestSerialize === "function" &&
        "responseSerialize" in method &&
        typeof method.responseSerialize === "function",
    )
  );
};

/**
 * @param {import("@grpc/grpc-js").Server} server
 * @param {import("@grpc/grpc-js").GrpcObject} grpcObject
 * @param {StubRepository} repository
 * @param {MessageRegistry} messageRegistry
 * @param {boolean} verbose
 */
const registerServices = (server, grpcObject, repository, messageRegistry, verbose) => {
  for (const [key, value] of Object.entries(grpcObject)) {
    if (isProtobufType(value)) {
      continue;
    }
    if (isGrpcService(value)) {
      console.log(`[grpc-mock] register ${key}`);
      server.addService(
        value.service,
        createServiceHandler(key, value.service, repository, messageRegistry, verbose),
      );
      continue;
    }
    if (typeof value === "object") {
      registerServices(server, value, repository, messageRegistry, verbose);
    }
  }
};

/** @param {string} depsDir */
const collectWellKnownProtoDirs = (depsDir) => {
  const candidates = [
    path.join(depsDir, "node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ltf-front/node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ltcr-front/node_modules/grpc-tools/bin"),
    path.join(workspaceRoot, "ownd-lp/node_modules/grpc-tools/bin"),
  ];

  return candidates.filter((dir) => fileExists(path.join(dir, "google/protobuf/wrappers.proto")));
};

const run = () => {
  const options = parseArgs(process.argv.slice(2));
  const requireFromDeps = resolveDependencyRequire(options.depsDir);
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- depsDir で解決した公式パッケージに公開型を付与する。
  const grpc = /** @type {typeof import("@grpc/grpc-js")} */ (requireFromDeps("@grpc/grpc-js"));
  const protoLoader = /** @type {typeof import("@grpc/proto-loader")} */ (
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- depsDir で解決した公式パッケージに公開型を付与する。
    requireFromDeps("@grpc/proto-loader")
  );

  const protoFiles = findProtoFiles(options.protoDir);
  const serviceProtoFiles = protoFiles.filter((file) => hasServiceDefinition(file));
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
    if (error) {
      throw error;
    }
    console.log(`[grpc-mock] listening on ${bindAddress} (bound:${port})`);
    console.log(`[grpc-mock] protoDir=${options.protoDir}`);
    console.log(`[grpc-mock] stubDir=${options.stubDir}`);
  });
};

try {
  run();
} catch (error) {
  console.error("[grpc-mock] failed to start");
  console.error(error);
  process.exitCode = 1;
}
