import { Request, Response } from "express";
import { quizSubmissionSchema } from "../../../client/src/infrastructure/validations/quiz.schema";
import { db } from "server/src/db";
import { leads } from "server/src/db/schema";

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body;

    const { score, profile, ...answers } = body;

    const validationResult = quizSubmissionSchema.safeParse(answers);

    if (!validationResult.success) {
      res.status(400).json({
        error: "InvalidPayloadFormat",
        details: validationResult.error.format(),
      });
      return;
    }

    const newLead = await db
      .insert(leads)
      .values({
        name: validationResult.data.name,
        email: validationResult.data.email,
        score,
        profile,
        rawAnswers: validationResult.data,
      })
      .returning({
        id: leads.id,
        email: leads.email,
      });

    res.status(201).json({
      message: "Lead captured successfully",
      data: newLead[0],
    });
  } catch (error: unknown) {
    console.error("LeadController Error:", error);

    const dbError = error as { code?: string };

    if (dbError.code === "23505") {
      res.status(409).json({ error: "EmailAlreadyExists" });
      return;
    }

    res.status(500).json({ error: "InternalServerError" });
  }
};
