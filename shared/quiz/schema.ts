import { z } from "zod";

export const quizSubmissionSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Por favor, introduza um endereço de e-mail válido."),
  phone: z.string("Por favor, introduza um número de telefone válido."),
  moment: z.enum(["considering", "transitioning", "started", "established"]),
  clarity: z.enum(["clear", "partial", "unclear"]),
  obstacles: z
    .array(z.string())
    .max(2, "Selecione no máximo 2 opções.")
    .optional(),
  clients: z.enum(["none", "pontual", "irregular", "stable"]),
  timeline: z.enum(["3m", "3-6m", "6-12m", "undefined"]),
  "main-question": z
    .string()
    .min(2, "Por favor, elabore um pouco mais a sua pergunta."),
});

export type QuizSubmissionPayload = z.infer<typeof quizSubmissionSchema>;
