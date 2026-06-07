import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "@/domain/quiz/data";

interface QuizQuestionProps {
  question: Question;
  answer: string | string[];
  onAnswer: (value: string | string[]) => void;
  maxCheckboxes?: number;
}

export default function QuizQuestion({
  question,
  answer,
  onAnswer,
  maxCheckboxes = 2,
}: QuizQuestionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (question.type === "text") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          placeholder={question.placeholder}
          value={(answer as string) || ""}
          onChange={e => onAnswer(e.target.value)}
          className="text-base py-6 px-4 border-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all"
        />
      </motion.div>
    );
  }

  if (question.type === "textarea") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Textarea
          placeholder={question.placeholder}
          value={(answer as string) || ""}
          onChange={e => onAnswer(e.target.value)}
          className="text-base py-4 px-4 border-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary min-h-32 rounded-lg transition-all"
        />
      </motion.div>
    );
  }

  if (question.type === "radio") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <RadioGroup value={(answer as string) || ""} onValueChange={onAnswer}>
          <motion.div className="space-y-3">
            {question.options?.map(option => {
              const isSelected = answer === option.value;

              return (
                <motion.div
                  key={option.value}
                  variants={itemVariants}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-transparent hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className={`mt-1 border-2 transition-colors ${
                      isSelected
                        ? "border-primary text-primary"
                        : "border-muted-foreground group-hover:border-primary/50"
                    }`}
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer text-base leading-relaxed text-foreground"
                  >
                    {option.label}
                  </Label>
                </motion.div>
              );
            })}
          </motion.div>
        </RadioGroup>
      </motion.div>
    );
  }

  if (question.type === "checkbox") {
    const selectedCount = Array.isArray(answer) ? answer.length : 0;
    const isMaxed = selectedCount >= maxCheckboxes;

    const handleCheckboxChange = (value: string, checked: boolean) => {
      let newAnswer = Array.isArray(answer) ? [...answer] : [];

      if (checked) {
        if (!isMaxed) {
          newAnswer.push(value);
        }
      } else {
        newAnswer = newAnswer.filter(v => v !== value);
      }

      onAnswer(newAnswer);
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-3">
          {question.options?.map(option => {
            const isChecked =
              Array.isArray(answer) && answer.includes(option.value);
            const isDisabled = isMaxed && !isChecked;

            return (
              <motion.div
                key={option.value}
                variants={itemVariants}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                  isChecked
                    ? "border-primary bg-primary/10"
                    : "border-border bg-transparent hover:border-primary/50 hover:bg-primary/5"
                } ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent"
                    : ""
                }`}
              >
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={checked =>
                    handleCheckboxChange(option.value, checked as boolean)
                  }
                  disabled={isDisabled}
                  className={`mt-1 border-2 transition-colors ${
                    isChecked
                      ? "border-primary"
                      : "border-muted-foreground group-hover:border-primary/50"
                  }`}
                />
                <Label
                  htmlFor={option.value}
                  className={`flex-1 cursor-pointer text-base leading-relaxed text-foreground ${
                    isDisabled ? "cursor-not-allowed" : ""
                  }`}
                >
                  {option.label}
                </Label>
              </motion.div>
            );
          })}
        </motion.div>
        {maxCheckboxes > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-muted-foreground mt-4"
          >
            {selectedCount}/{maxCheckboxes} selecionadas
          </motion.p>
        )}
      </motion.div>
    );
  }

  return null;
}
