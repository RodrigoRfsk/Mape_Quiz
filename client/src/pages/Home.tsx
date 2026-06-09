import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import QuizHero from "@/components/QuizHero";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import AiAnalysis from "@/components/AiAnalysis";

import {
  QUIZ_QUESTIONS,
  SCORING_RULES,
  getCategoryDisplayData,
} from "@/domain/quiz/data";
import { quizSubmissionSchema } from "@shared/quiz/schema";
import { useQuizStore } from "@/app/store/quiz.store";
import { loadQuizProgress } from "@/infrastructure/api/quiz-session.service";
import { ZodError } from "zod";

export default function Home() {
  const currentQuestionIndex = useQuizStore(
    state => state.currentQuestionIndex
  );
  const answers = useQuizStore(state => state.answers);
  const isFinished = useQuizStore(state => state.isFinished);
  const isSubmitting = useQuizStore(state => state.isSubmitting);
  const submitError = useQuizStore(state => state.submitError);
  const score = useQuizStore(state => state.score);
  const profile = useQuizStore(state => state.profile);

  const setAnswer = useQuizStore(state => state.setAnswer);
  const nextQuestion = useQuizStore(state => state.nextQuestion);
  const previousQuestion = useQuizStore(state => state.previousQuestion);
  const finishQuiz = useQuizStore(state => state.finishQuiz);
  const resetQuiz = useQuizStore(state => state.resetQuiz);
  const beginQuiz = useQuizStore(state => state.beginQuiz);
  const applyRemoteProgress = useQuizStore(state => state.applyRemoteProgress);

  const [stepError, setStepError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    const state = useQuizStore.getState();
    return (
      state.status === "in_progress" && Object.keys(state.answers).length > 0
    );
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    setAnswer(currentQuestion.id, value);
    if (stepError) setStepError(null);
  };

  const handleStart = () => {
    beginQuiz();
    setStepError(null);
    setHasStarted(true);
  };

  const handleRestart = () => {
    resetQuiz();
    setStepError(null);
    setHasStarted(false);
  };

  useEffect(() => {
    const state = useQuizStore.getState();
    if (
      !state.sessionId ||
      state.status === "completed" ||
      Object.keys(state.answers).length > 0
    ) {
      return;
    }

    void loadQuizProgress(state.sessionId).then(remote => {
      if (
        remote &&
        !remote.completed &&
        Object.keys(remote.answers).length > 0
      ) {
        applyRemoteProgress(remote.answers, remote.currentQuestionIndex);
        setHasStarted(true);
      }
    });
  }, [applyRemoteProgress]);

  const triggerAiAnalysis = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    nextQuestion();
  };

  const handleNext = async () => {
    const fieldSchema =
      quizSubmissionSchema.shape[
        currentQuestion.id as keyof typeof quizSubmissionSchema.shape
      ];

    if (fieldSchema && !currentQuestion.optional) {
      const result = fieldSchema.safeParse(answers[currentQuestion.id]);

      if (!result.success) {
        const zodError = result.error as ZodError<string | string[]>;
        const errorMessage = zodError.issues[0]?.message || "Valor inválido.";
        setStepError(errorMessage);
        return;
      }
    }

    setStepError(null);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      if (currentQuestionIndex === 3 || currentQuestionIndex === 8) {
        triggerAiAnalysis();
      } else {
        nextQuestion();
      }
    } else {
      console.info("Dispatching final quiz submission");
      await finishQuiz(SCORING_RULES);
    }
  };

  const isAnswered =
    currentQuestion.optional ||
    (answers[currentQuestion.id] !== undefined &&
      answers[currentQuestion.id] !== "" &&
      (Array.isArray(answers[currentQuestion.id])
        ? answers[currentQuestion.id].length > 0
        : true));

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      if (!hasStarted || isFinished || isAnalyzing || isSubmitting) return;
      if (!isAnswered) return;

      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;

      event.preventDefault();
      void handleNext();
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [
    hasStarted,
    isFinished,
    isAnalyzing,
    isSubmitting,
    isAnswered,
    currentQuestionIndex,
    answers,
  ]);

  const getErrorMessage = (errorKey: string) => {
    switch (errorKey) {
      case "EmailAlreadyExists":
        return "Este e-mail já realizou o mapeamento. Por favor, tente com outro endereço.";
      case "ValidationFailed":
        return "Verifique se todos os campos estão preenchidos corretamente.";
      case "WebhookSubmissionFailed":
      case "InternalClientError":
      default:
        return "Ocorreu um erro de comunicação com os servidores. Tente novamente.";
    }
  };

  if (isFinished && score !== null && profile !== null) {
    const categoryDisplay = getCategoryDisplayData(profile);
    return (
      <QuizResults
        answers={answers}
        profile={profile}
        category={categoryDisplay}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="hero-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.4 } }}
            className="flex-1 flex flex-col"
          >
            <QuizHero onStart={handleStart} />
          </motion.div>
        ) : (
          <motion.div
            key="quiz-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex-1"
          >
            <div className="relative container max-w-3xl py-12 md:py-20">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Pergunta {currentQuestionIndex + 1} de{" "}
                    {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center min-h-[400px] border-2 border-border bg-card p-8 md:p-12 neo-card shadow-lg rounded-xl"
                  >
                    <AiAnalysis onComplete={handleAnalysisComplete} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-2 border-border bg-card p-6 sm:p-8 md:p-12 neo-card shadow-lg">
                      <div className="max-w-2xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-center"
                        >
                          <h2 className="neo-display text-3xl md:text-4xl mb-2 text-foreground">
                            {currentQuestion.question}
                          </h2>
                          {currentQuestion.subtext && (
                            <p className="text-sm text-muted-foreground mb-6">
                              {currentQuestion.subtext}
                            </p>
                          )}
                        </motion.div>

                        <QuizQuestion
                          question={currentQuestion}
                          answer={answers[currentQuestion.id]}
                          onAnswer={handleAnswer}
                          maxCheckboxes={2}
                        />
                      </div>

                      {stepError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-md flex items-center gap-3 text-destructive"
                        >
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <p className="text-sm font-medium">{stepError}</p>
                        </motion.div>
                      )}

                      {submitError &&
                        currentQuestionIndex === QUIZ_QUESTIONS.length - 1 &&
                        !stepError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-md flex items-center gap-3 text-destructive"
                          >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">
                              {getErrorMessage(submitError)}
                            </p>
                          </motion.div>
                        )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isAnalyzing && (
                <motion.div
                  className="flex gap-4 mt-8 justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStepError(null);
                      previousQuestion();
                    }}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                    className="px-6 py-2 border-2 border-border hover:bg-muted"
                  >
                    ← Anterior
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isAnswered || isSubmitting}
                    className="px-8 py-2 bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold flex items-center gap-2 group min-w-[140px] justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />A
                        processar...
                      </>
                    ) : currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Finalizar
                      </>
                    ) : (
                      <>
                        Próxima
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {!isAnalyzing && (
                <motion.div
                  className="mt-8 flex gap-2 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[1, 2, 3, 4].map(block => (
                    <div
                      key={block}
                      className={`h-2 rounded-full transition-all ${
                        currentQuestion.block >= block
                          ? "bg-primary w-8"
                          : "bg-border w-2"
                      }`}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
