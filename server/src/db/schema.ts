import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  score: integer("score").notNull(),
  profile: text("profile").notNull(),

  rawAnswers: jsonb("raw_answers").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull().unique(),

  answers: jsonb("answers").notNull(),
  currentQuestionIndex: integer("current_question_index").notNull().default(0),
  lastQuestionId: text("last_question_id"),
  answeredCount: integer("answered_count").notNull().default(0),

  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  profile: text("profile"),

  startedAt: timestamp("started_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
