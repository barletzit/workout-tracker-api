import { FastifyReply, FastifyRequest } from "fastify";
import { AuthHeaders, BaseEntity, IdParam } from "./types";

export interface CrudHandler<T extends BaseEntity> {
  create: (
    req: FastifyRequest<{
      Body: Omit<T, keyof BaseEntity>;
      Headers: AuthHeaders;
    }>,
    reply: FastifyReply
  ) => Promise<T>;

  findOne: (
    req: FastifyRequest<{
      Params: IdParam;
      Headers: AuthHeaders;
    }>,
    reply: FastifyReply
  ) => Promise<T | undefined>;

  findMany: (
    req: FastifyRequest<{
      Headers: AuthHeaders;
    }>,
    reply: FastifyReply
  ) => Promise<T[]>;

  update: (
    req: FastifyRequest<{
      Params: IdParam;
      Body: Partial<Omit<T, keyof BaseEntity>>;
      Headers: AuthHeaders;
    }>,
    reply: FastifyReply
  ) => Promise<T>;

  delete: (
    req: FastifyRequest<{
      Params: IdParam;
      Headers: AuthHeaders;
    }>,
    reply: FastifyReply
  ) => Promise<void>;
}
