import { create } from "zustand";
import {
  QuizAnswers,
  ScoringRules,
  ProfileCategory,
} from "../../domain/quiz/types";
import {
  calculateConsultingScore,
  determineProfile,
} from "../../domain/quiz/scoring.service";
import { quizSubmissionSchema } from "../../infrastructure/validations/quiz.schema";
import { submitQuizLead } from "../../infrastructure/api/quiz.service";

interface QuizState {
  answers: QuizAnswers;
  currentQuestionIndex: number;
  isFinished: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  score: number | null;
  profile: ProfileCategory | null;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: (rules: ScoringRules) => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  answers: {},
  currentQuestionIndex: 0,
  isFinished: false,
  isSubmitting: false,
  submitError: null,
  score: null,
  profile: null,

  setAnswer: (questionId, answer) =>
    set(state => ({
      answers: { ...state.answers, [questionId]: answer },
      submitError: null,
    })),

  nextQuestion: () =>
    set(state => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  previousQuestion: () =>
    set(state => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),

  finishQuiz: async rules => {
    const { answers } = get();

    set({ isSubmitting: true, submitError: null });

    const validationResult = quizSubmissionSchema.safeParse(answers);

    if (!validationResult.success) {
      console.error("Validation failed", validationResult.error.format());
      set({
        isSubmitting: false,
        submitError: "ValidationFailed",
      });
      return;
    }

    const score = calculateConsultingScore(answers, rules);
    const profile = determineProfile(score);

    try {
      await submitQuizLead(validationResult.data, score, profile);

      console.log("Quiz finished successfully", {
        finalScore: score,
        profileCategory: profile,
      });

      set({
        isSubmitting: false,
        isFinished: true,
        score,
        profile,
      });
    } catch (error) {
      console.error("Failed to finish quiz API layer", error);
      set({
        isSubmitting: false,
        submitError: "SubmissionError",
      });
    }
  },

  resetQuiz: () => {
    console.log("Resetting quiz state to initial values");

    set({
      answers: {},
      currentQuestionIndex: 0,
      isFinished: false,
      isSubmitting: false,
      submitError: null,
      score: null,
      profile: null,
    });
  },
}));
