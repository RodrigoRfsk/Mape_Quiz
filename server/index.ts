import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
// 👇 Importação da nossa nova rota de Leads
import { leadRoutes } from "./src/routes/lead.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ============================================================================
  // 1. MIDDLEWARES GLOBAIS
  // ============================================================================

  // Permite pedidos locais do Vite (Porta 3000) durante o desenvolvimento
  app.use(
    cors({
      origin:
        process.env.NODE_ENV !== "production"
          ? "http://localhost:3000"
          : undefined,
    })
  );

  // Habilita o parse de JSON na payload dos pedidos (Crucial para a submissão do Quiz)
  app.use(express.json());

  // ============================================================================
  // 2. ROTAS DE API (Backend)
  // ============================================================================
  // Nota: Estas rotas devem OBRIGATORIAMENTE ser registadas antes dos ficheiros estáticos

  app.use("/api/leads", leadRoutes);

  // ============================================================================
  // 3. FICHEIROS ESTÁTICOS & SPA ROUTING (Frontend)
  // ============================================================================

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`[Server] Running gracefully on http://localhost:${port}/`);
    console.log(
      `[Server] API Endpoint ready at http://localhost:${port}/api/leads`
    );
  });
}

startServer().catch(error => {
  console.error("[Server] Fatal error during startup:", error);
  process.exit(1);
});
