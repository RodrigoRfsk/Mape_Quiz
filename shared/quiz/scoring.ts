export interface ScoringRules {
  [questionId: string]: Record<string, number>;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export type ProfileCode = "A" | "B" | "C";

const MAX_POSSIBLE_SCORE = 280;

export const SCORING_RULES: ScoringRules = {
  experience: {
    "less-10": 10,
    "10-15": 20,
    "15-20": 30,
    "more-20": 40,
  },
  moment: {
    considering: 10,
    transitioning: 30,
    started: 50,
    established: 70,
  },
  clarity: {
    unclear: 20,
    partial: 50,
    clear: 80,
  },
  clients: {
    none: 10,
    pontual: 30,
    irregular: 60,
    stable: 90,
  },
};

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

  const normalizedScore = Math.min(
    100,
    Math.round((rawScore / MAX_POSSIBLE_SCORE) * 100)
  );

  return normalizedScore;
};

export const determineProfile = (answers: QuizAnswers): ProfileCode => {
  const moment = answers.moment;
  const clients = answers.clients;

  if (moment === "considering" || moment === "transitioning") return "A";

  if (
    moment === "started" ||
    (moment === "established" && clients === "irregular")
  )
    return "B";

  return "C";
};
