import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";

export function createDbConnection(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 10,
  });

  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDbConnection>;

export type User = typeof schema.usersTable.$inferSelect;
