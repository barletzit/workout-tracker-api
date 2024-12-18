import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service";

export const authHandlers = (service: ReturnType<typeof authService>) => {
  return {
    registerHandler: async (req: FastifyRequest, reply: FastifyReply) => {
      const result = await service.register();
      return result;
    },
    loginHandler: async (req: FastifyRequest, reply: FastifyReply) => {
      const result = await service.login();
      return result;
    },
    logoutHandler: async (req: FastifyRequest, reply: FastifyReply) => {
      const result = await service.logout();
      return result;
    },
  };
};
