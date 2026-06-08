import { QuizSubmissionPayload } from "@shared/quiz/schema";

export class ApiSubmissionError extends Error {
  constructor(
    public code: string,
    public statusCode: number
  ) {
    super(`API Error: ${code}`);
    this.name = "ApiSubmissionError";
  }
}

/**
 * Envia o lead para a API (Express), que valida, recalcula score/perfil e
 * persiste. A notificação ao orquestrador de marketing (n8n) é responsabilidade
 * do backend — o cliente sempre fala apenas com a própria API.
 */
export const submitQuizLead = async (
  payload: QuizSubmissionPayload,
  score: number,
  profile: string
): Promise<void> => {
  const endpoint =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api/leads";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, score, profile }),
  });

  if (!response.ok) {
    let errorCode = "SubmissionError";

    try {
      const errorData = (await response.json()) as { error?: string };
      if (errorData.error) {
        errorCode = errorData.error;
      }
    } catch {
      console.error("Failed to parse API error response");
    }

    throw new ApiSubmissionError(errorCode, response.status);
  }
};
