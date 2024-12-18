import { PgTable } from "drizzle-orm/pg-core";
import { FastifyInstance } from "fastify";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm/sql";
import { BaseEntity } from "../../types/types";
import { NewUser, User } from "../../db";

export const usersService = (fastify: FastifyInstance) => {
  const db = fastify.db;
  return {
    createUser: async (data: Omit<NewUser, keyof BaseEntity>) => {
      const [user] = await db.insert(users).values(data).returning();
      return user;
    },
    updateUser: async (
      id: number,
      data: Partial<Omit<User, keyof BaseEntity>>
    ) => {
      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
      return user;
    },
    findUser: async (id: number) => {
      return db.query.users.findFirst({ where: eq(users.id, id) });
    },
    findUsers: async () => {
      return db.query.users.findMany();
    },
    deleteUser: async (id: number) => {
      return db.delete(users).where(eq(users.id, id));
    },
  };
};
