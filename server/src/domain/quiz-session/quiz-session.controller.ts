import { Request, Response } from "express";
import {
  saveQuizSession,
  getQuizSession,
  SessionValidationError,
} from "./quiz-session.service";

export const upsertSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const session = await saveQuizSession(req.params.sessionId, req.body);
    res.status(200).json({ data: session });
  } catch (error: unknown) {
    if (error instanceof SessionValidationError) {
      res.status(400).json({ error: error.message, details: error.details });
      return;
    }

    console.error(
      "QuizSession upsert failure:",
      error instanceof Error ? error.message : "Unknown state"
    );
    res.status(500).json({ error: "InternalServerError" });
  }
};

export const readSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const session = await getQuizSession(req.params.sessionId);

    if (!session) {
      res.status(404).json({ error: "SessionNotFound" });
      return;
    }

    res.status(200).json({ data: session });
  } catch (error: unknown) {
    console.error(
      "QuizSession read failure:",
      error instanceof Error ? error.message : "Unknown state"
    );
    res.status(500).json({ error: "InternalServerError" });
  }
};
