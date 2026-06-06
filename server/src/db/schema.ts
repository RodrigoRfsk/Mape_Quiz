import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
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
