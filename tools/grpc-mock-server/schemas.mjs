import { z } from "zod";

export const fieldSchema = z.object({
  name: z.string(),
  jsonName: z.string().optional(),
  type: z.string(),
  typeName: z.string().default(""),
  label: z.string().optional(),
});

/** @typedef {z.infer<typeof fieldSchema>} Field */
/** @typedef {{ name?: string | undefined; field: Field[]; nestedType: Message[] }} Message */

/** @type {z.ZodType<Message>} */
export const messageSchema = z.lazy(() =>
  z.object({
    name: z.string().optional(),
    field: z.array(fieldSchema).default([]),
    nestedType: z.array(messageSchema).default([]),
  }),
);

export const messageDefinitionSchema = z.object({
  format: z.literal("Protocol Buffer 3 DescriptorProto"),
  type: messageSchema,
});

export const responseDefinitionSchema = z.object({
  responseType: z.object({ type: messageSchema }),
});

export const stubSchema = z.record(z.string(), z.json());

export const errorSchema = z.object({
  __isError: z.boolean().optional(),
  __error: z.union([z.boolean(), z.string()]).optional(),
  message: z.string().optional(),
  code: z.number().optional(),
  details: z.string().optional(),
});
