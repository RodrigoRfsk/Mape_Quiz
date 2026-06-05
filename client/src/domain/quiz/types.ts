export interface ScoringRules {
  [questionId: string]: Record<string, number>;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export type ProfileCategory =
  | "Especialista em Cargo CLT"
  | "Especialista em Transição"
  | "Consultor Iniciante"
  | "Consultor Estruturado";
