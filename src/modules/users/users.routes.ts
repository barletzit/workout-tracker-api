import { FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "./users.service";
import { CrudHandler } from "../../types/crud-handler.interface";
import { User } from "./users.schema";

export const usersHandlers = (
  service: ReturnType<typeof usersService>
): CrudHandler<User> => {
  return {
    findMany: async (req, reply) => {
      try {
        const users = await service.findUsers();
        return users;
      } catch (error) {
        req.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
    findOne: async (req, reply) => {
      const user = await service.findUser(req.params.id);
      return user;
    },
    create: async (req, reply) => {
      const result = await service.createUser(req.body);
      return result;
    },
    update: async (req, reply) => {
      const result = await service.updateUser(req.params.id, req.body);
      return result;
    },
    delete: async (req, reply) => {
      await service.deleteUser(req.params.id);
    },
  };
};
