import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Configure server/.env (see server/.env.example)."
  );
}

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool);
