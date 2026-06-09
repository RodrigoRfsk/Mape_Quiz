import { Router } from "express";
import { upsertSession, readSession } from "./quiz-session.controller";

const router = Router();

router.put("/:sessionId", upsertSession);
router.get("/:sessionId", readSession);

export { router as quizSessionRoutes };
