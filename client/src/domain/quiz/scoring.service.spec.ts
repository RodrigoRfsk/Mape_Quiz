import { describe, it, expect } from "vitest";
import { calculateConsultingScore, determineProfile } from "./scoring.service";
import { ScoringRules, QuizAnswers } from "./types";

describe("Scoring Service", () => {
  const mockRules: ScoringRules = {
    experience: { entry: 10, senior: 40 },
    moment: { exploring: 10, ready: 70 },
  };

  it("should calculate correct score for single answers", () => {
    const answers: QuizAnswers = { experience: "senior", moment: "ready" };
    const score = calculateConsultingScore(answers, mockRules);

    expect(score).toBe(110);
  });

  it("should handle missing questions in rules without throwing errors", () => {
    const answers: QuizAnswers = { experience: "entry", unknown: "value" };
    const score = calculateConsultingScore(answers, mockRules);

    expect(score).toBe(10);
  });

  it("should return correct profile category based on score ranges", () => {
    expect(determineProfile(20)).toBe("Especialista em Cargo CLT");
    expect(determineProfile(45)).toBe("Especialista em Transição");
    expect(determineProfile(65)).toBe("Consultor Iniciante");
    expect(determineProfile(85)).toBe("Consultor Estruturado");
  });
});
