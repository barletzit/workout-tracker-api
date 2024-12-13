import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createDbConnection(connectionString: string) {
  const pool = new Pool({
    connectionString,
    max: 10,
  });

  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDbConnection>;

export type User = typeof schema.users.$inferSelect;
export type WorkoutType = typeof schema.workoutTypes.$inferInsert;
export type MusclesGroup = typeof schema.musclesGroup.$inferSelect;
export type Plan = typeof schema.plans.$inferSelect;
export type Workout = typeof schema.workouts.$inferSelect;
export type Exercise = typeof schema.exercises.$inferSelect;
export type WorkoutSession = typeof schema.workoutSessions.$inferSelect;
export type WorkoutSetEntry = typeof schema.workoutSetEntries.$inferSelect;

export type NewUser = typeof schema.users.$inferInsert;
export type NewWorkoutType = typeof schema.workoutTypes.$inferInsert;
export type NewMusclesGroup = typeof schema.musclesGroup.$inferInsert;
export type NewPlan = typeof schema.plans.$inferInsert;
export type NewWorkout = typeof schema.workouts.$inferInsert;
export type NewExercise = typeof schema.exercises.$inferInsert;
export type NewWorkoutSession = typeof schema.workoutSessions.$inferInsert;
export type NewWorkoutSetEntry = typeof schema.workoutSetEntries.$inferInsert;
