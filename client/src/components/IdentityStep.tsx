import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/PhoneInput";
import { QuizAnswers } from "@/domain/quiz/types";

interface IdentityStepProps {
  answers: QuizAnswers;
  onChange: (id: string, value: string) => void;
}

const fieldClass =
  "text-base py-6 px-4 border-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all";

export default function IdentityStep({ answers, onChange }: IdentityStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 text-left"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Nome completo
        </label>
        <Input
          value={(answers.name as string) || ""}
          onChange={event => onChange("name", event.target.value)}
          placeholder="Seu nome completo"
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          E-mail
        </label>
        <Input
          type="email"
          value={(answers.email as string) || ""}
          onChange={event => onChange("email", event.target.value)}
          placeholder="seu@email.com"
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          WhatsApp
        </label>
        <PhoneInput
          value={(answers.phone as string) || ""}
          onAnswer={value => onChange("phone", value)}
          placeholder="(11) 99999-9999"
        />
      </div>
    </motion.div>
  );
}
