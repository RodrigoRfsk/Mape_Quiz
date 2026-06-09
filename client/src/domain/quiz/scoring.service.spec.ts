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

    expect(score).toBe(46);
  });

  it("should handle missing questions in rules without throwing errors", () => {
    const answers: QuizAnswers = { experience: "entry", unknown: "value" };
    const score = calculateConsultingScore(answers, mockRules);

    expect(score).toBe(4);
  });

  it("should classify the audience profile (A/B/C) from the answers", () => {
    expect(determineProfile({ moment: "considering" })).toBe("A");
    expect(determineProfile({ moment: "transitioning" })).toBe("A");

    expect(determineProfile({ moment: "started" })).toBe("B");
    expect(
      determineProfile({ moment: "established", clients: "irregular" })
    ).toBe("B");

    expect(determineProfile({ moment: "established", clients: "stable" })).toBe(
      "C"
    );
    expect(determineProfile({ moment: "established" })).toBe("C");
  });
});
