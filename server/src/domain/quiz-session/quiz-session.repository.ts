import { eq } from "drizzle-orm";
import { db } from "@server/db";
import { quizSessions } from "@server/db/schema";
import { QuizSessionUpsertPayload } from "./quiz-session.schema";

export const findQuizSession = async (sessionId: string) => {
  const rows = await db
    .select()
    .from(quizSessions)
    .where(eq(quizSessions.sessionId, sessionId));

  return rows[0] ?? null;
};

export const upsertQuizSession = async (
  sessionId: string,
  payload: QuizSessionUpsertPayload
) => {
  const now = new Date();
  const completed = payload.completed ?? false;

  const mutableFields = {
    answers: payload.answers,
    currentQuestionIndex: payload.currentQuestionIndex,
    lastQuestionId: payload.lastQuestionId ?? null,
    answeredCount: payload.answeredCount ?? Object.keys(payload.answers).length,
    completed,
    score: payload.score ?? null,
    profile: payload.profile ?? null,
    updatedAt: now,
    completedAt: completed ? now : null,
  };

  const rows = await db
    .insert(quizSessions)
    .values({ sessionId, startedAt: now, ...mutableFields })
    .onConflictDoUpdate({
      target: quizSessions.sessionId,
      set: mutableFields,
    })
    .returning();

  return rows[0];
};
