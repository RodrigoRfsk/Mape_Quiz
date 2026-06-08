import { QuizSubmissionPayload } from "../validations/quiz.schema";

export class ApiSubmissionError extends Error {
  constructor(
    public code: string,
    public statusCode: number
  ) {
    super(`API Error: ${code}`);
    this.name = "ApiSubmissionError";
  }
}

interface QuizLeadProvider {
  submit(
    payload: QuizSubmissionPayload,
    score: number,
    profile: string
  ): Promise<void>;
}

const ApiProvider: QuizLeadProvider = {
  async submit(payload, score, profile) {
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
  },
};

const WebhookProvider: QuizLeadProvider = {
  async submit(payload, score, profile) {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error("Webhook URL is missing from environment variables");
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload, meta: { score, profile } }),
    });

    if (!response.ok) {
      throw new ApiSubmissionError("WebhookSubmissionFailed", response.status);
    }
  },
};

export const submitQuizLead = async (
  payload: QuizSubmissionPayload,
  score: number,
  profile: string
): Promise<void> => {
  const strategy = import.meta.env.VITE_SUBMISSION_STRATEGY || "API";

  console.log(`Executing lead submission with ${strategy} strategy`);

  if (strategy === "WEBHOOK") {
    await WebhookProvider.submit(payload, score, profile);
  } else {
    await ApiProvider.submit(payload, score, profile);
  }
};
