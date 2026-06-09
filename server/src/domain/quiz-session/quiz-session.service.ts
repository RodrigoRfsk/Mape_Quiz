import { quizSessionUpsertSchema } from "./quiz-session.schema";
import { findQuizSession, upsertQuizSession } from "./quiz-session.repository";

export class SessionValidationError extends Error {
  public details: unknown;

  constructor(details: unknown) {
    super("InvalidSessionPayload");
    this.name = "SessionValidationError";
    this.details = details;
  }
}

export const saveQuizSession = async (sessionId: string, rawPayload: unknown) => {
  const result = quizSessionUpsertSchema.safeParse(rawPayload);

  if (!result.success) {
    throw new SessionValidationError(result.error.format());
  }

  return upsertQuizSession(sessionId, result.data);
};

export const getQuizSession = async (sessionId: string) => {
  return findQuizSession(sessionId);
};
