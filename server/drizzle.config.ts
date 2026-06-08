import { defineConfig } from "drizzle-kit";
import path from "node:path";
import dotenv from "dotenv";

// Carrega o server/.env. O comando `pnpm db:push` roda a partir da raiz do
// repo, então resolvemos o caminho relativo ao cwd (raiz) -> server/.env.
dotenv.config({ path: path.resolve(process.cwd(), "server/.env"), quiet: true });

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL não está definida. Configure server/.env (veja server/.env.example)."
  );
}

export default defineConfig({
  schema: "./server/src/db/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
