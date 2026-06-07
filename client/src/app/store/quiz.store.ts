import {
  calculateConsultingScore,
  determineProfile,
} from "@/domain/quiz/scoring.service";
import {
  QuizAnswers,
  ProfileCategory,
  ScoringRules,
} from "@/domain/quiz/types";
import {
  submitQuizLead,
  ApiSubmissionError,
} from "@/infrastructure/api/quiz.service";
import { quizSubmissionSchema } from "@/infrastructure/validations/quiz.schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
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
          console.error("Payload validation failed during submission");
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

          console.log("Lead captured and quiz finalized successfully");

          set({
            isSubmitting: false,
            isFinished: true,
            score,
            profile,
          });
        } catch (error: unknown) {
          console.error("Critical failure at API integration layer", error);

          if (error instanceof ApiSubmissionError) {
            set({
              isSubmitting: false,
              submitError: error.code,
            });
            return;
          }

          set({
            isSubmitting: false,
            submitError: "InternalClientError",
          });
        }
      },

      resetQuiz: () => {
        console.log("Flushing store and resetting quiz state");
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
    }),
    {
      name: "mape-quiz-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        isFinished: state.isFinished,
        score: state.score,
        profile: state.profile,
      }),
    }
  )
);
