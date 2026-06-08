import { QuizAnswers, ScoringRules, ProfileCode } from "./types";

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

/**
 * Classifica o lead em um dos três perfis da audiência MAPE (A/B/C).
 *
 * Diferente do score (0–100, que mede maturidade), o perfil é qualitativo e
 * baseado no MOMENTO de carreira — é o que define qual cadência de e-mail e
 * WhatsApp o lead deve receber. A lógica espelha o `calcPerfil` da pesquisa
 * original, traduzida para os valores de opção do app:
 *
 * - A (Indeciso Estratégico): ainda no corporativo ou saiu há menos de 6 meses.
 * - B (Consultor Iniciante): já iniciou e tem alguns clientes, ou atua há mais
 *   de 18 meses mas com recorrência ainda irregular.
 * - C (Frustrado Recente): já tentou e busca reorganizar o que existe.
 */
export const determineProfile = (answers: QuizAnswers): ProfileCode => {
  const moment = answers.moment;
  const clients = answers.clients;

  if (moment === "considering" || moment === "transitioning") return "A";

  if (moment === "started" || (moment === "established" && clients === "irregular"))
    return "B";

  return "C";
};
