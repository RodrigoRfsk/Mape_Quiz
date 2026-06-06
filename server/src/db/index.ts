import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

// The database connection string should be managed via environment variables
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://admin:Jfafcuxnd29@localhost:5432/mape_quiz";

const pool = new Pool({
  connectionString,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool);
