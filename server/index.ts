import "./env";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { leadRoutes } from "@server/domain/lead/lead.routes";
import { quizSessionRoutes } from "@server/domain/quiz-session/quiz-session.routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  const corsOrigin =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "http://localhost:3000");

  app.use(cors({ origin: corsOrigin }));

  app.use(express.json());

  app.use("/api/leads", leadRoutes);
  app.use("/api/quiz-sessions", quizSessionRoutes);

  const staticPath = path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

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
