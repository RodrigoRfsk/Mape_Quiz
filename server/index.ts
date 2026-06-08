import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { leadRoutes } from "./src/domain/lead/lead.routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(
    cors({
      origin:
        process.env.NODE_ENV !== "production"
          ? "http://localhost:3000"
          : undefined,
    })
  );

  app.use(express.json());

  app.use("/api/leads", leadRoutes);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

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
