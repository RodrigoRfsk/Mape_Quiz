import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./server/src/db/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgres://admin:Jfafcuxnd29@localhost:5432/mape_quiz",
  },
  verbose: true,
  strict: true,
});
