import {
  calculateConsultingScore,
  determineProfile,
} from "@/domain/quiz/scoring.service";
import { QUIZ_QUESTIONS } from "@/domain/quiz/data";
import { QuizAnswers, ProfileCode, ScoringRules } from "@/domain/quiz/types";
import {
  submitQuizLead,
  ApiSubmissionError,
} from "@/infrastructure/api/quiz.service";
import { saveQuizProgress } from "@/infrastructure/api/quiz-session.service";
import { quizSubmissionSchema } from "@shared/quiz/schema";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type QuizStatus = "idle" | "in_progress" | "completed";

interface QuizState {
  sessionId: string | null;
  status: QuizStatus;
  answers: QuizAnswers;
  currentQuestionIndex: number;
  isFinished: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  score: number | null;
  profile: ProfileCode | null;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  beginQuiz: () => void;
  applyRemoteProgress: (
    answers: QuizAnswers,
    currentQuestionIndex: number
  ) => void;
  finishQuiz: (rules: ScoringRules) => Promise<void>;
  resetQuiz: () => void;
}

const AUTOSAVE_DELAY_MS = 700;

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

const buildProgress = (state: QuizState) => ({
  answers: state.answers,
  currentQuestionIndex: state.currentQuestionIndex,
  lastQuestionId: QUIZ_QUESTIONS[state.currentQuestionIndex]?.id,
  answeredCount: Object.keys(state.answers).length,
});

const scheduleAutosave = (get: () => QuizState) => {
  if (autosaveTimer) clearTimeout(autosaveTimer);

  autosaveTimer = setTimeout(() => {
    const state = get();
    if (!state.sessionId) return;
    void saveQuizProgress(state.sessionId, buildProgress(state));
  }, AUTOSAVE_DELAY_MS);
};

const freshSession = (): Partial<QuizState> => ({
  sessionId: nanoid(),
  answers: {},
  currentQuestionIndex: 0,
  isFinished: false,
  submitError: null,
  score: null,
  profile: null,
  status: "in_progress",
});

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      status: "idle",
      answers: {},
      currentQuestionIndex: 0,
      isFinished: false,
      isSubmitting: false,
      submitError: null,
      score: null,
      profile: null,

      setAnswer: (questionId, answer) => {
        set(state => ({
          answers: { ...state.answers, [questionId]: answer },
          submitError: null,
        }));
        scheduleAutosave(get);
      },

      nextQuestion: () => {
        set(state => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        }));
        scheduleAutosave(get);
      },

      previousQuestion: () => {
        set(state => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        }));
        scheduleAutosave(get);
      },

      beginQuiz: () => {
        const { status, answers, sessionId } = get();
        const hasProgress = Object.keys(answers).length > 0;

        if (status === "in_progress" && hasProgress) {
          if (!sessionId) set({ sessionId: nanoid() });
          scheduleAutosave(get);
          return;
        }

        set(freshSession());
        scheduleAutosave(get);
      },

      applyRemoteProgress: (answers, currentQuestionIndex) =>
        set({ answers, currentQuestionIndex, status: "in_progress" }),

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
        const profile = determineProfile(answers);

        try {
          await submitQuizLead(validationResult.data, score, profile);

          console.log("Lead captured and quiz finalized successfully");

          set({
            isSubmitting: false,
            isFinished: true,
            score,
            profile,
            status: "completed",
          });

          const finalState = get();
          if (finalState.sessionId) {
            void saveQuizProgress(finalState.sessionId, {
              ...buildProgress(finalState),
              completed: true,
              score,
              profile,
            });
          }
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
        if (autosaveTimer) clearTimeout(autosaveTimer);
        set({
          sessionId: null,
          status: "idle",
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
        sessionId: state.sessionId,
        status: state.status,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    }
  )
);
