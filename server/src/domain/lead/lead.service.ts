import { quizSubmissionSchema } from "@/infrastructure/validations/quiz.schema";
import { createLeadInDb } from "./lead.repository";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("EmailAlreadyExists");
    this.name = "EmailAlreadyExistsError";
  }
}

export class ValidationError extends Error {
  public details: unknown;

  constructor(details: unknown) {
    super("InvalidPayloadFormat");
    this.name = "ValidationError";
    this.details = details;
  }
}

interface LeadPayload {
  score: number;
  profile: string;
  answers: unknown;
}

const isDbUniqueViolation = (err: unknown): err is { code: string } => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
};

export const processLeadSubmission = async (payload: LeadPayload) => {
  const { score, profile, answers } = payload;

  const validationResult = quizSubmissionSchema.safeParse(answers);

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.format());
  }

  try {
    const newLead = await createLeadInDb({
      name: validationResult.data.name,
      email: validationResult.data.email,
      score,
      profile,
      rawAnswers: validationResult.data,
    });

    return newLead;
  } catch (error: unknown) {
    if (isDbUniqueViolation(error)) {
      throw new EmailAlreadyExistsError();
    }

    console.error("Database insertion failed:", error);
    throw error;
  }
};
