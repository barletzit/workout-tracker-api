// src/plugins/database.ts
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { createDbConnection, Database } from "../db";
import { sql } from "drizzle-orm";

interface DatabasePluginOptions {
  connectionString: string;
  maxConnections?: number;
}

declare module "fastify" {
  interface FastifyInstance {
    db: Database;
    checkDbConnection(): Promise<boolean>;
  }
}

const databasePlugin = fp<DatabasePluginOptions>(
  async (fastify: FastifyInstance, options: DatabasePluginOptions) => {
    try {
      const db = createDbConnection(options.connectionString);

      await db.execute(sql`SELECT 1`);

      fastify.log.info("Database connection established");

      fastify.decorate("db", db);

      fastify.decorate("checkDbConnection", async (): Promise<boolean> => {
        try {
          await db.execute(sql`SELECT 1`);
          return true;
        } catch (err) {
          fastify.log.error("Database connection check failed:", err);
          return false;
        }
      });

      fastify.addHook("onClose", async (instance: FastifyInstance) => {
        try {
          await instance.db.$client.end();
          fastify.log.info("Database connection closed");
        } catch (err) {
          fastify.log.error("Error closing database connection:", err);
        }
      });
    } catch (err) {
      fastify.log.error("Failed to establish database connection:", err);
      throw err;
    }
  },
  {
    name: "database-plugin",
  }
);

export default databasePlugin;
