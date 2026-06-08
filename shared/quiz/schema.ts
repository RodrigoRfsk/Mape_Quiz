import { z } from "zod";

export const quizSubmissionSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  area: z.string().min(2, "A área deve ter pelo menos 2 caracteres."),
  experience: z.enum(["less-10", "10-15", "15-20", "more-20"]),
  moment: z.enum(["considering", "transitioning", "started", "established"]),
  obstacles: z
    .array(z.string())
    .max(2, "Selecione no máximo 2 opções.")
    .optional(),
  "main-question": z
    .string()
    .min(2, "Por favor, elabore um pouco mais a sua pergunta."),
  email: z.string().email("Por favor, introduza um endereço de e-mail válido."),
  phone: z.string("Por favor, introduza um número de telefone válido."),
  clarity: z.enum(["clear", "partial", "unclear"]),
  sector: z.string().min(2, "O setor deve ter pelo menos 2 caracteres."),
  clients: z.enum(["none", "pontual", "irregular", "stable"]),
  "expected-result": z.enum([
    "structure",
    "positioning",
    "prospecting",
    "pricing",
    "consistency",
  ]),
  timeline: z.enum(["3m", "3-6m", "6-12m", "undefined"]),
  additional: z.string().optional(),
});

export type QuizSubmissionPayload = z.infer<typeof quizSubmissionSchema>;
