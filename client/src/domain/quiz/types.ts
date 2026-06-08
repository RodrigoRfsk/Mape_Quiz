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
