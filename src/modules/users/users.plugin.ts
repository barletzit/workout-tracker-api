import { FastifyInstance } from "fastify";
import { schema } from "../../utils";
import { usersService } from "./users.service";
import { usersHandlers } from "./users.routes";

export async function users(fastify: FastifyInstance) {
  const service = usersService(fastify);
  const handlers = usersHandlers(service);

  fastify.route({
    method: "GET",
    url: "/:id",
    // schema,
    handler: handlers.findOne,
  });
  fastify.route({
    method: "GET",
    url: "/",
    // schema,
    handler: handlers.findMany,
  });
  fastify.route({
    method: "PATCH",
    url: "/:id",
    schema,
    handler: handlers.update,
  });
  fastify.route({
    method: "POST",
    url: "/",
    schema,
    handler: handlers.create,
  });
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema,
    handler: handlers.delete,
  });
}
