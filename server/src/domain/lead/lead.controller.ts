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
    // O corpo traz as respostas (e, por compatibilidade, score/profile do
    // cliente). O serviço valida, recalcula score/profile e ignora os valores
    // enviados — então repassamos o corpo inteiro.
    const newLead = await processLeadSubmission(req.body);

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
