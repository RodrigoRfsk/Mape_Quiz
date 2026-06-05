import { QuizSubmissionPayload } from "../validations/quiz.schema";

export const submitQuizLead = async (
  payload: QuizSubmissionPayload,
  score: number,
  profile: string
): Promise<void> => {
  console.log("Initiating lead submission payload", {
    payload,
    score,
    profile,
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    console.error("Submission failed due to network error");
    throw new Error("NetworkError");
  }

  console.log("Lead submitted successfully");
};
