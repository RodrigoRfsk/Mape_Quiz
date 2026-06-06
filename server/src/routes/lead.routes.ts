import { Router } from "express";
import { createLead } from "../controllers/lead.controller";

const router = Router();

router.post("/", createLead);

export { router as leadRoutes };
