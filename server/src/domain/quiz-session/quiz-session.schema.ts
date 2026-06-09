import { z } from "zod";

export const quizSessionUpsertSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  currentQuestionIndex: z.number().int().min(0),
  lastQuestionId: z.string().optional(),
  answeredCount: z.number().int().min(0).optional(),
  completed: z.boolean().optional(),
  score: z.number().int().optional(),
  profile: z.enum(["A", "B", "C"]).optional(),
});

export type QuizSessionUpsertPayload = z.infer<typeof quizSessionUpsertSchema>;
