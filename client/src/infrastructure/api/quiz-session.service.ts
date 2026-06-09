import { ProfileCode } from "@shared/quiz/scoring";

export interface QuizProgressPayload {
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  lastQuestionId?: string;
  answeredCount?: number;
  completed?: boolean;
  score?: number;
  profile?: ProfileCode;
}

export interface RemoteQuizSession {
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  completed: boolean;
}

const resolveSessionsUrl = (): string => {
  const leadsUrl =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api/leads";
  return leadsUrl.replace(/\/leads\/?$/, "/quiz-sessions");
};

export const saveQuizProgress = async (
  sessionId: string,
  payload: QuizProgressPayload
): Promise<void> => {
  try {
    await fetch(`${resolveSessionsUrl()}/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error: unknown) {
    console.warn("Failed to autosave quiz progress", error);
  }
};

export const loadQuizProgress = async (
  sessionId: string
): Promise<RemoteQuizSession | null> => {
  try {
    const response = await fetch(`${resolveSessionsUrl()}/${sessionId}`);
    if (!response.ok) return null;

    const json = (await response.json()) as { data?: RemoteQuizSession };
    return json.data ?? null;
  } catch (error: unknown) {
    console.warn("Failed to load quiz progress", error);
    return null;
  }
};
