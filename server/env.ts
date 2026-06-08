import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

/**
 * Carrega o server/.env independentemente do diretório de onde o processo foi
 * iniciado (cwd). Como `pnpm dev:server` roda a partir da raiz do monorepo, um
 * `import "dotenv/config"` leria o .env da raiz — não o do servidor. Resolvendo
 * o caminho a partir deste arquivo, a config do servidor é sempre encontrada.
 *
 * IMPORTANTE: este módulo precisa ser o PRIMEIRO import do server/index.ts,
 * antes de qualquer módulo que leia process.env no carregamento (ex.: o pool
 * do banco em @server/db).
 */
const serverDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(serverDir, ".env"), quiet: true });
