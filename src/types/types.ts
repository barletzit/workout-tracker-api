import z from "zod";

export const baseEntitySchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const authHeaderSchema = z.object({
  authorization: z.string().startsWith("Bearer "),
});

export const idParamSchema = z.object({
  id: z.coerce.number(),
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;
export type AuthHeaders = z.infer<typeof authHeaderSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
