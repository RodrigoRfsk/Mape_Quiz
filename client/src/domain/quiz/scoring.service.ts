import { QuizAnswers, ScoringRules, ProfileCategory } from "./types";

export const calculateConsultingScore = (
  answers: QuizAnswers,
  rules: ScoringRules
): number => {
  let rawScore = 0;

  Object.entries(answers).forEach(([questionId, answer]) => {
    const questionRules = rules[questionId];

    if (!questionRules) return;

    if (Array.isArray(answer)) {
      answer.forEach(val => {
        if (questionRules[val]) {
          rawScore += questionRules[val];
        }
      });
    } else {
      if (questionRules[answer]) {
        rawScore += questionRules[answer];
      }
    }
  });

  const MAX_POSSIBLE_SCORE = 280;

  const normalizedScore = Math.min(
    100,
    Math.round((rawScore / MAX_POSSIBLE_SCORE) * 100)
  );

  console.log("Score calculation completed", {
    rawScore,
    normalizedScore,
  });

  return normalizedScore;
};

export const determineProfile = (score: number): ProfileCategory => {
  if (score <= 30) return "Especialista em Cargo CLT";
  if (score <= 50) return "Especialista em Transição";
  if (score <= 70) return "Consultor Iniciante";

  return "Consultor Estruturado";
};
