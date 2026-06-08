import { quizSubmissionSchema } from "@shared/quiz/schema";
import {
  calculateConsultingScore,
  determineProfile,
  SCORING_RULES,
  QuizAnswers,
} from "@shared/quiz/scoring";
import { createLeadInDb } from "./lead.repository";
import { dispatchLeadToOrchestrator } from "./lead.webhook";

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

const isDbUniqueViolation = (err: unknown): err is { code: string } => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
};

export const processLeadSubmission = async (rawPayload: unknown) => {
  const validationResult = quizSubmissionSchema.safeParse(rawPayload);

  if (!validationResult.success) {
    throw new ValidationError(validationResult.error.format());
  }

  const answers = validationResult.data;

  // O backend é a fonte da verdade: score e perfil são recalculados a partir
  // das respostas validadas, nunca confiando nos valores enviados pelo cliente
  // (que poderiam ser adulterados). O cliente usa a mesma lógica compartilhada
  // apenas para exibir o resultado na hora, então os valores coincidem.
  const answersForScoring = answers as unknown as QuizAnswers;
  const score = calculateConsultingScore(answersForScoring, SCORING_RULES);
  const profile = determineProfile(answersForScoring);

  try {
    const newLead = await createLeadInDb({
      name: answers.name,
      email: answers.email,
      score,
      profile,
      rawAnswers: answers,
    });

    // Persistiu → só então notifica o orquestrador (n8n), que lê o `profile`
    // para acionar a sequência de e-mails/mensagens correspondente.
    await dispatchLeadToOrchestrator({
      id: newLead.id,
      name: answers.name,
      email: answers.email,
      score,
      profile,
      answers,
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
