/**
 * Lógica de domínio do quiz MAPE — fonte única da verdade.
 *
 * Este módulo é consumido tanto pelo cliente (React, para exibir o resultado na
 * hora) quanto pelo servidor (Express, que recalcula score e perfil antes de
 * persistir). Manter a regra aqui garante que os dois lados produzam sempre o
 * mesmo resultado e evita duplicação.
 */

export interface ScoringRules {
  [questionId: string]: Record<string, number>;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

/**
 * Código de perfil da audiência MAPE, alinhado às copys de e-mail e WhatsApp
 * (Manifesto de Audiência). É este código — "A", "B" ou "C" — que segue no
 * payload do lead e dispara a cadência de comunicação correspondente.
 *
 * A — O Indeciso Estratégico   (foco majoritário · 60%)
 * B — O Consultor Iniciante    (pote de mel · 25%)
 * C — O Frustrado Recente      (atenção · 15%)
 */
export type ProfileCode = "A" | "B" | "C";

/** Pontuação máxima possível somando o teto de cada eixo pontuado. */
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

/**
 * Calcula o "score de consultoria" (0–100) — uma métrica de maturidade,
 * normalizada a partir da soma bruta dos pesos das respostas.
 */
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

  if (
    moment === "started" ||
    (moment === "established" && clients === "irregular")
  )
    return "B";

  return "C";
};
