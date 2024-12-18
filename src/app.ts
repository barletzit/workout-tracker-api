import Fastify, { FastifyInstance } from "fastify";
import databasePlugin from "./plugins/database.plugin";
import { envConfig } from "./config";
import { users } from "./modules/users/users.plugin";
import { auth } from "./modules/auth/auth.plugin";

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

  await fastify.register(databasePlugin, {
    connectionString: envConfig.database.url,
    maxConnections: 10,
  });

  await fastify.register(users, { prefix: "users" });
  await fastify.register(auth, { prefix: "auth" });

  return fastify;
}
