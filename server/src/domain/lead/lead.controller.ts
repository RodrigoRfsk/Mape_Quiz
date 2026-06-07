import { Request, Response } from "express";
import {
  processLeadSubmission,
  EmailAlreadyExistsError,
  ValidationError,
} from "./lead.service";

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { score, profile, ...answers } = req.body;

    const newLead = await processLeadSubmission({ score, profile, answers });

    res.status(201).json({
      message: "Lead captured successfully",
      data: newLead,
    });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res.status(400).json({
        error: error.message,
        details: error.details,
      });
      return;
    }

    if (error instanceof EmailAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }

    console.error(
      "LeadController critical failure:",
      error instanceof Error ? error.message : "Unknown state"
    );
    res.status(500).json({ error: "InternalServerError" });
  }
};
