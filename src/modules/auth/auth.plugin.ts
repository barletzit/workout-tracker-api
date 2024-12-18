import { FastifyInstance } from "fastify";
import { schema } from "../../utils";
import { authService } from "./auth.service";
import { authHandlers } from "./auth.routes";
import { usersService } from "../users/users.service";

export async function auth(fastify: FastifyInstance) {
  const users = usersService(fastify);
  const service = authService(fastify, users);
  const handlers = authHandlers(service);

  fastify.route({
    method: "POST",
    url: "/register",
    schema,
    handler: handlers.registerHandler,
  });
  fastify.route({
    method: "POST",
    url: "/login",
    schema,
    handler: handlers.loginHandler,
  });
  fastify.route({
    method: "POST",
    url: "/logout",
    schema,
    handler: handlers.logoutHandler,
  });
}
