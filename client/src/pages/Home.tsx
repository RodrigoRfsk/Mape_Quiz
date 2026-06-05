import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import QuizHero from "@/components/QuizHero";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: string;
  block: number;
  type: "text" | "radio" | "checkbox";
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  optional?: boolean;
  subtext?: string;
}

const QUIZ_QUESTIONS: Question[] = [
  // BLOCO 1: Identificação e Momento de Carreira
  {
    id: "name",
    block: 1,
    type: "text",
    question: "Qual é o seu nome completo?",
    placeholder: "Digite seu nome",
  },
  {
    id: "area",
    block: 1,
    type: "text",
    question: "Qual é a sua área de atuação principal ao longo da carreira?",
    placeholder:
      "Ex: Finanças corporativas, Operações, Estratégia, RH, Tecnologia...",
  },
  {
    id: "experience",
    block: 1,
    type: "radio",
    question: "Há quantos anos você está no mercado profissional?",
    options: [
      { value: "less-10", label: "Menos de 10 anos" },
      { value: "10-15", label: "Entre 10 e 15 anos" },
      { value: "15-20", label: "Entre 15 e 20 anos" },
      { value: "more-20", label: "Mais de 20 anos" },
    ],
  },
  {
    id: "moment",
    block: 1,
    type: "radio",
    question: "Como você descreveria seu momento atual?",
    options: [
      {
        value: "considering",
        label:
          "Ainda estou no ambiente corporativo — estou considerando a transição para consultoria",
      },
      {
        value: "transitioning",
        label:
          "Estou em processo de transição — saí nos últimos 6 meses e ainda estou estruturando minha entrada",
      },
      {
        value: "started",
        label:
          "Já iniciei como consultor — tenho alguns clientes, mas sem consistência ou método definido",
      },
      {
        value: "established",
        label:
          "Atuo como consultor independente há mais de 18 meses — quero estruturar melhor o que já existe",
      },
    ],
  },
  {
    id: "obstacles",
    block: 2,
    type: "checkbox",
    question:
      "Qual é o principal obstáculo que você enfrenta (ou antecipa) na transição para consultoria?",
    subtext: "Selecione até 2 opções",
    options: [
      {
        value: "offer",
        label:
          "Não sei como transformar minha experiência em uma oferta clara para o mercado",
      },
      {
        value: "niche",
        label:
          "Tenho dificuldade em definir meu nicho — quero atender muitos perfis de cliente",
      },
      {
        value: "pricing",
        label:
          "Não sei como precificar meus serviços sem sentir que estou pedindo demais ou de menos",
      },
      {
        value: "leads",
        label:
          "Dependo de indicações e não tenho um processo ativo para gerar novas oportunidades",
      },
      {
        value: "authority",
        label:
          "Sinto que me falta autoridade ou visibilidade no mercado consultivo",
      },
      {
        value: "irregular",
        label:
          "Já tentei, mas os projetos chegam de forma irregular e sem previsibilidade",
      },
      {
        value: "scale",
        label:
          "Tenho clientes, mas não sei como escalar ou tornar o negócio mais consistente",
      },
    ],
  },
  {
    id: "main-question",
    block: 2,
    type: "text",
    question:
      "Em uma frase, qual é a pergunta que você mais gostaria que a masterclass respondesse?",
    placeholder:
      "Seja específico — essa informação orienta diretamente o conteúdo",
  },
  {
    id: "email",
    block: 1,
    type: "text",
    question: "Qual é o seu melhor email para contato?",
    placeholder: "seu@email.com",
  },
  // BLOCO 3: Sua Experiência e Posicionamento
  {
    id: "clarity",
    block: 3,
    type: "radio",
    question:
      "Você consegue descrever, hoje, o problema específico que resolve para as organizações?",
    options: [
      {
        value: "clear",
        label:
          "Sim — tenho clareza sobre o problema, o perfil de cliente e o que entrego",
      },
      {
        value: "partial",
        label:
          "Parcialmente — tenho uma ideia, mas ainda está impreciso ou amplo demais",
      },
      {
        value: "unclear",
        label:
          "Ainda não — sei o que sei fazer, mas não consigo articular isso como uma oferta de mercado",
      },
    ],
  },
  {
    id: "sector",
    block: 3,
    type: "text",
    question:
      "Qual é o setor ou perfil de organização com maior potencial para a sua consultoria?",
    placeholder:
      "Ex: Empresas familiares em processo de profissionalização, indústria de médio porte...",
  },
  {
    id: "clients",
    block: 3,
    type: "radio",
    question: "Você já tem algum cliente ou projeto de consultoria ativo?",
    options: [
      { value: "none", label: "Não — ainda não iniciei" },
      {
        value: "pontual",
        label: "Tive um ou dois projetos, mas de forma pontual",
      },
      {
        value: "irregular",
        label: "Tenho clientes ativos, mas a recorrência é irregular",
      },
      {
        value: "stable",
        label:
          "Tenho uma carteira de clientes com receita relativamente estável",
      },
    ],
  },
  // BLOCO 4: Expectativa e Próximo Passo
  {
    id: "expected-result",
    block: 4,
    type: "radio",
    question:
      "Qual resultado concreto você espera ter clareza sobre ao sair da masterclass?",
    options: [
      {
        value: "structure",
        label:
          "Como estruturar minha entrada no mercado consultivo com método e não por tentativa e erro",
      },
      {
        value: "positioning",
        label:
          "Como definir minha oferta e posicionamento de forma que o mercado entenda e valorize",
      },
      {
        value: "prospecting",
        label:
          "Como criar um processo de prospecção que não dependa só de rede e indicações",
      },
      {
        value: "pricing",
        label:
          "Como precificar corretamente e sair da armadilha do tempo pelo dinheiro",
      },
      {
        value: "consistency",
        label:
          "Como organizar o que já existe para gerar mais consistência e previsibilidade",
      },
    ],
  },
  {
    id: "timeline",
    block: 4,
    type: "radio",
    question:
      "Qual é o seu horizonte de tempo para estar operando como consultor?",
    options: [
      { value: "3m", label: "Nos próximos 3 meses" },
      { value: "3-6m", label: "Entre 3 e 6 meses" },
      { value: "6-12m", label: "Entre 6 meses e 1 ano" },
      { value: "undefined", label: "Ainda não tenho prazo definido" },
    ],
  },
  {
    id: "additional",
    block: 4,
    type: "text",
    question:
      "Há algo mais que queira compartilhar sobre o seu momento ou o que espera da Jornada MAPE?",
    placeholder: "Campo livre — use se quiser dar mais contexto (opcional)",
    optional: true,
  },
];

// Sistema de pontuação
const SCORING_RULES = {
  experience: {
    "less-10": 10,
    "10-15": 20,
    "15-20": 30,
    "more-20": 40,
  },
  moment: {
    considering: 10,
    transitioning: 30,
    started: 50,
    established: 70,
  },
  clarity: {
    unclear: 20,
    partial: 50,
    clear: 80,
  },
  clients: {
    none: 10,
    pontual: 30,
    irregular: 60,
    stable: 90,
  },
};

function calculateScore(answers: Record<string, any>): number {
  let score = 0;

  // Experience points
  if (
    answers.experience &&
    SCORING_RULES.experience[
      answers.experience as keyof typeof SCORING_RULES.experience
    ]
  ) {
    score +=
      SCORING_RULES.experience[
        answers.experience as keyof typeof SCORING_RULES.experience
      ];
  }

  // Moment points
  if (
    answers.moment &&
    SCORING_RULES.moment[answers.moment as keyof typeof SCORING_RULES.moment]
  ) {
    score +=
      SCORING_RULES.moment[answers.moment as keyof typeof SCORING_RULES.moment];
  }

  // Clarity points
  if (
    answers.clarity &&
    SCORING_RULES.clarity[answers.clarity as keyof typeof SCORING_RULES.clarity]
  ) {
    score +=
      SCORING_RULES.clarity[
        answers.clarity as keyof typeof SCORING_RULES.clarity
      ];
  }

  // Clients points
  if (
    answers.clients &&
    SCORING_RULES.clients[answers.clients as keyof typeof SCORING_RULES.clients]
  ) {
    score +=
      SCORING_RULES.clients[
        answers.clients as keyof typeof SCORING_RULES.clients
      ];
  }

  // Normalize to 0-100 scale
  return Math.min(100, Math.round((score / 280) * 100));
}

function getCategory(score: number): {
  label: string;
  description: string;
  color: string;
  icon: string;
} {
  if (score <= 30) {
    return {
      label: "Especialista em Cargo CLT",
      description:
        "Você está consolidado no ambiente corporativo e considerando os primeiros passos para consultoria.",
      color: "from-blue-500 to-blue-600",
      icon: "💼",
    };
  } else if (score <= 50) {
    return {
      label: "Especialista em Transição",
      description:
        "Você está em processo de transição, com experiência sólida e começando a estruturar sua entrada no mercado consultivo.",
      color: "from-purple-500 to-purple-600",
      icon: "🚀",
    };
  } else if (score <= 70) {
    return {
      label: "Consultor Iniciante",
      description:
        "Você já iniciou como consultor e tem alguns clientes, mas precisa de método e consistência para escalar.",
      color: "from-orange-500 to-orange-600",
      icon: "⚡",
    };
  } else {
    return {
      label: "Consultor Estruturado",
      description:
        "Você já tem uma base sólida de clientes e receita. Agora é hora de otimizar, escalar e criar previsibilidade.",
      color: "from-green-500 to-green-600",
      icon: "👑",
    };
  }
}

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion: Question = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isAnswered =
    answers[currentQuestion.id] !== undefined &&
    (currentQuestion.optional || answers[currentQuestion.id] !== "");

  if (showResults) {
    const score = calculateScore(answers);
    const category = getCategory(score);
    return <QuizResults answers={answers} score={score} category={category} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <QuizHero />

      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent" />
        </div>

        <div className="relative container py-12 md:py-20">
          {/* Progress Bar */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Pergunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-border bg-card/50 backdrop-blur-sm p-8 md:p-12 neo-card shadow-lg">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="neo-display text-3xl md:text-4xl mb-2 text-foreground">
                      {currentQuestion.question}
                    </h2>
                    {currentQuestion.subtext && (
                      <p className="text-sm text-muted-foreground mb-6">
                        {currentQuestion.subtext}
                      </p>
                    )}
                  </motion.div>

                  <QuizQuestion
                    question={currentQuestion as any}
                    answer={answers[currentQuestion.id]}
                    onAnswer={handleAnswer}
                    maxCheckboxes={2}
                  />
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="flex gap-4 mt-8 justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border-2 border-border hover:bg-card/50"
            >
              ← Anterior
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-8 py-2 bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold flex items-center gap-2 group"
            >
              {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizar
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Block Indicator */}
          <motion.div
            className="mt-8 flex gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[1, 2, 3, 4].map(block => (
              <div
                key={block}
                className={`h-2 rounded-full transition-all ${
                  currentQuestion.block >= block
                    ? "bg-primary w-8"
                    : "bg-border w-2"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
