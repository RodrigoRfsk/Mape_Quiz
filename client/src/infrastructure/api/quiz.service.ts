import { QuizSubmissionPayload } from "../validations/quiz.schema";

interface QuizLeadProvider {
  submit(
    payload: QuizSubmissionPayload,
    score: number,
    profile: string
  ): Promise<void>;
}

// Strategy A: Custom Backend (Express/Node)
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
      throw new Error("ApiProvider: Failed to submit lead");
    }
  },
};

// Strategy B: Webhook (n8n, Make, Zapier)
const WebhookProvider: QuizLeadProvider = {
  async submit(payload, score, profile) {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) throw new Error("Webhook URL is not defined");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload, meta: { score, profile } }),
    });

    if (!response.ok) {
      throw new Error("WebhookProvider: Failed to submit lead");
    }
  },
};

// Orchestrator
export const submitQuizLead = async (
  payload: QuizSubmissionPayload,
  score: number,
  profile: string
): Promise<void> => {
  const strategy = import.meta.env.VITE_SUBMISSION_STRATEGY || "API";

  console.log(`Initiating lead submission using ${strategy} strategy`);

  if (strategy === "WEBHOOK") {
    await WebhookProvider.submit(payload, score, profile);
  } else {
    await ApiProvider.submit(payload, score, profile);
  }
};
