import fastify, { FastifyInstance } from "fastify";
import { usersService } from "../users/users.service";

export const authService = (
  fastify: FastifyInstance,
  usersService_: ReturnType<typeof usersService>
) => {
  return {
    register: async () => {
      usersService_.createUser();
      return { register: "success" };
    },
    login: async () => {
      return { login: "success" };
    },
    logout: async () => {
      return { logout: "success" };
    },
  };
};
