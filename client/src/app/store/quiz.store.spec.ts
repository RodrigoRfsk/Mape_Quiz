import { describe, it, expect, beforeEach, vi } from "vitest";
import { useQuizStore } from "./quiz.store";
import { SCORING_RULES } from "../../domain/quiz/data";

vi.mock("@/infrastructure/api/quiz.service", () => ({
  submitQuizLead: vi.fn().mockResolvedValue(undefined),
  ApiSubmissionError: class ApiSubmissionError extends Error {},
}));

vi.mock("@/infrastructure/api/quiz-session.service", () => ({
  saveQuizProgress: vi.fn().mockResolvedValue(undefined),
  loadQuizProgress: vi.fn().mockResolvedValue(null),
}));

describe("Quiz Store", () => {
  beforeEach(() => {
    useQuizStore.getState().resetQuiz();
  });

  it("should initialize with default values", () => {
    const state = useQuizStore.getState();

    expect(state.answers).toEqual({});
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.isFinished).toBe(false);
    expect(state.score).toBeNull();
    expect(state.profile).toBeNull();
  });

  it("should set an answer correctly preserving previous state", () => {
    const store = useQuizStore.getState();

    store.setAnswer("q1", "answer1");
    store.setAnswer("q2", ["answer2a", "answer2b"]);

    const updatedState = useQuizStore.getState();

    expect(updatedState.answers).toEqual({
      q1: "answer1",
      q2: ["answer2a", "answer2b"],
    });
  });

  it("should navigate to next and previous questions preventing negative indexes", () => {
    const store = useQuizStore.getState();

    store.nextQuestion();
    expect(useQuizStore.getState().currentQuestionIndex).toBe(1);

    store.previousQuestion();
    expect(useQuizStore.getState().currentQuestionIndex).toBe(0);

    store.previousQuestion();
    expect(useQuizStore.getState().currentQuestionIndex).toBe(0);
  });

  it("should process quiz completion and emit the audience profile code", async () => {
    const store = useQuizStore.getState();

    const validAnswers: Record<string, string | string[]> = {
      name: "Maria Silva",
      area: "Finanças corporativas",
      experience: "more-20",
      moment: "started",
      "main-question": "Como estruturar minha entrada?",
      email: "maria@example.com",
      phone: "(11) 99999-9999",
      clarity: "partial",
      sector: "Indústria de médio porte",
      clients: "pontual",
      "expected-result": "structure",
      timeline: "3m",
    };

    Object.entries(validAnswers).forEach(([id, value]) =>
      store.setAnswer(id, value)
    );

    await store.finishQuiz(SCORING_RULES);

    const finalState = useQuizStore.getState();

    expect(finalState.isFinished).toBe(true);
    expect(finalState.score).toBeGreaterThan(0);
    expect(finalState.profile).toBe("B");
  });
});
