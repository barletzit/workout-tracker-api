import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  pgEnum,
  date,
  numeric,
} from "drizzle-orm/pg-core";

export const workoutTypeEnum = pgEnum("workout_type_enum", ["A", "B", "C"]);
export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "Beginner",
  "Intermediate",
  "Advanced",
]);

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  goals: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const workoutTypes = pgTable("workout_types", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  type: workoutTypeEnum("workout_type_enum").notNull(),
  ...timestamps,
});

export const plans = pgTable("plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  ...timestamps,
});

export const workouts = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  description: varchar({ length: 255 }).notNull(),
  workoutTypeId: integer("workout_type_id")
    .references(() => workoutTypes.id)
    .notNull(),
  ...timestamps,
});

export const musclesGroup = pgTable("muscles_group", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  workoutTypeId: integer("workout_type_id")
    .references(() => workoutTypes.id)
    .notNull(),
  muscles: text("muscles").array().notNull(),
  ...timestamps,
});

export const planWorkouts = pgTable("plan_workouts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  planId: integer("plan_id")
    .references(() => plans.id)
    .notNull(),
  workoutId: integer("workout_id")
    .references(() => workouts.id)
    .notNull(),
  workoutTypeId: integer("workout_type_id")
    .references(() => workoutTypes.id)
    .notNull(),
  ...timestamps,
});

export const exercises = pgTable("exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  muscleGroupId: integer("muscle_group_id")
    .references(() => musclesGroup.id)
    .notNull(),
  difficultyLevel: difficultyLevelEnum("difficulty_level").notNull(),
  sets: integer("sets").default(3),
  reps: integer("reps").default(8),
  instructions: text("instructions").notNull(),
  videoUrl: text("video_url"),
  imageUrls: text("image_urls").array(),
  ...timestamps,
});

export const workoutExercises = pgTable("workout_exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer("workout_id")
    .references(() => workouts.id)
    .notNull(),
  exerciseId: integer("exercise_id")
    .references(() => exercises.id)
    .notNull(),
  orderIndex: integer("order_index").notNull(),
  ...timestamps,
});

export const workoutSessions = pgTable("workout_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  planId: integer("plan_id")
    .references(() => plans.id)
    .notNull(),
  workoutId: integer("workout_id")
    .references(() => workouts.id)
    .notNull(),
  date: date("date").notNull(),
  ...timestamps,
});

export const workoutSetEntries = pgTable("workout_set_entries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  workoutSessionId: integer("workout_session_id")
    .references(() => workoutSessions.id)
    .notNull(),
  exerciseId: integer("exercise_id")
    .references(() => exercises.id)
    .notNull(),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").default(8),
  weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
  notes: text("notes"),
  ...timestamps,
});

// relations
export const usersRelations = relations(users, ({ many }) => ({
  plans: many(plans),
  workouts: many(workouts),
  exercises: many(exercises),
  workoutSessions: many(workoutSessions),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  user: one(users, {
    fields: [plans.userId],
    references: [users.id],
  }),
  planWorkouts: many(planWorkouts),
  workoutSessions: many(workoutSessions),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  workoutType: one(workoutTypes, {
    fields: [workouts.workoutTypeId],
    references: [workoutTypes.id],
  }),
  planWorkouts: many(planWorkouts),
  workoutExercises: many(workoutExercises),
  workoutSessions: many(workoutSessions),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  user: one(users, {
    fields: [exercises.userId],
    references: [users.id],
  }),
  muscleGroup: one(musclesGroup, {
    fields: [exercises.muscleGroupId],
    references: [musclesGroup.id],
  }),
  workoutExercises: many(workoutExercises),
  workoutSetEntries: many(workoutSetEntries),
}));

export const workoutSessionsRelations = relations(
  workoutSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [workoutSessions.userId],
      references: [users.id],
    }),
    plan: one(plans, {
      fields: [workoutSessions.planId],
      references: [plans.id],
    }),
    workout: one(workouts, {
      fields: [workoutSessions.workoutId],
      references: [workouts.id],
    }),
    setEntries: many(workoutSetEntries),
  })
);

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
  })
);

export const workoutSetEntriesRelations = relations(
  workoutSetEntries,
  ({ one }) => ({
    workoutSession: one(workoutSessions, {
      fields: [workoutSetEntries.workoutSessionId],
      references: [workoutSessions.id],
    }),
    exercise: one(exercises, {
      fields: [workoutSetEntries.exerciseId],
      references: [exercises.id],
    }),
  })
);

export const planWorkoutsRelations = relations(planWorkouts, ({ one }) => ({
  plan: one(plans, {
    fields: [planWorkouts.planId],
    references: [plans.id],
  }),
  workout: one(workouts, {
    fields: [planWorkouts.workoutId],
    references: [workouts.id],
  }),
  workoutType: one(workoutTypes, {
    fields: [planWorkouts.workoutTypeId],
    references: [workoutTypes.id],
  }),
}));

export const musclesGroupsRelations = relations(
  musclesGroup,
  ({ one, many }) => ({
    workoutType: one(workoutTypes, {
      fields: [musclesGroup.workoutTypeId],
      references: [workoutTypes.id],
    }),
    exercises: many(exercises),
  })
);

export const workoutTypeRelations = relations(workoutTypes, ({ many }) => ({
  workouts: many(workouts),
  musclesGroups: many(musclesGroup),
  planWorkouts: many(planWorkouts),
}));
