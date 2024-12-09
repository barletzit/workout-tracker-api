import Fastify, { FastifyInstance } from "fastify";
import databasePlugin from "./plugins/database";
import { envConfig } from "./config";

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });

  fastify.get("/", (request, reply) => {
    reply.send({ hello: "world" });
  });

  await fastify.register(databasePlugin, {
    connectionString: envConfig.database.url,
    maxConnections: 10,
  });

  return fastify;
}
