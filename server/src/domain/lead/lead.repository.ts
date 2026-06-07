import { QuizSubmissionPayload } from "@/infrastructure/validations/quiz.schema";
import { db } from "server/src/db";
import { leads } from "server/src/db/schema";

export interface LeadInsertData {
  name: string;
  email: string;
  score: number;
  profile: string;
  rawAnswers: QuizSubmissionPayload;
}

export const createLeadInDb = async (data: LeadInsertData) => {
  const result = await db.insert(leads).values(data).returning({
    id: leads.id,
    email: leads.email,
  });

  return result[0];
};
