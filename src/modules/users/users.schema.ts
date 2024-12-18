import z from "zod";
import { baseEntitySchema } from "../../types/types";

export const userSchema = baseEntitySchema.extend({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number().min(14),
  goals: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const userReqResValidationSchema = {
  create: {
    request: {
      body: z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string(),
        goals: z.string(),
      }),
    },
    response: {
      201: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        goals: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    },
  },
  findOne: {
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        goals: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    },
  },
  findMany: {},
  update: {},
  delete: {},
};
