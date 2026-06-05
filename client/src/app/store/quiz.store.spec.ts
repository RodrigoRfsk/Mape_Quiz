import { describe, it, expect, beforeEach } from "vitest";
import { useQuizStore } from "./quiz.store";
import { ScoringRules } from "../../domain/quiz/types";

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

  it("should process quiz completion and update score and profile", () => {
    const store = useQuizStore.getState();
    const mockRules: ScoringRules = {
      q1: { a1: 50 },
    };

    store.setAnswer("q1", "a1");
    store.finishQuiz(mockRules);

    const finalState = useQuizStore.getState();

    expect(finalState.isFinished).toBe(true);
    expect(finalState.score).toBe(50);
    expect(finalState.profile).toBe("Especialista em Transição");
  });
});
