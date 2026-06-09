import { ProfileCode } from "./types";

export { SCORING_RULES } from "@shared/quiz/scoring";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  block: number;
  type: "text" | "textarea" | "radio" | "checkbox" | "phone" | "identity";
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  optional?: boolean;
  subtext?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: "identity",
    block: 1,
    type: "identity",
    question: "Antes de começar, precisamos de algumas informações",
    subtext:
      "Usadas para personalizar o diagnóstico e para o acompanhamento.",
  },
  {
    id: "moment",
    block: 1,
    type: "radio",
    question: "Como você descreveria seu momento profissional hoje?",
    options: [
      {
        value: "considering",
        label:
          "Ainda estou no corporativo — estou considerando a transição para consultoria",
      },
      {
        value: "transitioning",
        label:
          "Estou em transição — saí nos últimos 6 meses e ainda estou estruturando minha entrada",
      },
      {
        value: "started",
        label:
          "Já iniciei como consultor — tenho alguns clientes, mas sem consistência ou método definido",
      },
      {
        value: "established",
        label:
          "Atuo como consultor há mais de 18 meses — quero estruturar melhor o que já existe",
      },
    ],
  },
  {
    id: "clarity",
    block: 2,
    type: "radio",
    question:
      "Você consegue descrever o problema específico que resolve para as organizações?",
    subtext: "Seja honesto — essa variável tem peso alto no diagnóstico.",
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
          "Ainda não — sei o que sei fazer, mas não consigo articular isso como oferta de mercado",
      },
    ],
  },
  {
    id: "obstacles",
    block: 2,
    type: "checkbox",
    question: "Qual é o principal obstáculo que você enfrenta hoje?",
    subtext: "Selecione até 2 opções",
    options: [
      {
        value: "offer",
        label:
          "Não sei como transformar minha trajetória em uma oferta que o mercado entenda e pague",
      },
      {
        value: "niche",
        label:
          "Dificuldade em definir nicho — quero atender muitos perfis de cliente",
      },
      {
        value: "pricing",
        label:
          "Não sei como precificar sem sentir que estou pedindo demais ou de menos",
      },
      {
        value: "leads",
        label:
          "Dependo de indicações e não tenho processo ativo para gerar novas oportunidades",
      },
      {
        value: "authority",
        label:
          "Sinto que me falta autoridade ou visibilidade no mercado consultivo",
      },
      {
        value: "irregular",
        label:
          "Projetos chegam de forma irregular — sem previsibilidade ou consistência",
      },
    ],
  },
  {
    id: "clients",
    block: 3,
    type: "radio",
    question: "Você já tem algum cliente ou projeto de consultoria ativo?",
    options: [
      { value: "none", label: "Não — ainda não iniciei nenhum projeto" },
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
        label: "Tenho uma carteira com receita relativamente estável",
      },
    ],
  },
  {
    id: "timeline",
    block: 3,
    type: "radio",
    question:
      "Qual é o seu horizonte de tempo para estar operando — ou com a consultoria mais estruturada?",
    options: [
      { value: "3m", label: "Nos próximos 3 meses" },
      { value: "3-6m", label: "Entre 3 e 6 meses" },
      { value: "6-12m", label: "Entre 6 meses e 1 ano" },
      { value: "undefined", label: "Ainda não tenho prazo definido" },
    ],
  },
  {
    id: "main-question",
    block: 4,
    type: "textarea",
    question:
      "Em uma frase: qual é a pergunta que você mais gostaria que a masterclass respondesse?",
    subtext: "Quanto mais específico, mais útil para calibrar o conteúdo.",
    placeholder: "Escreva sua principal pergunta aqui...",
  },
];

export const getCategoryDisplayData = (profile: ProfileCode) => {
  const map: Record<
    ProfileCode,
    {
      code: ProfileCode;
      label: string;
      description: string;
      color: string;
      icon: string;
    }
  > = {
    A: {
      code: "A",
      label: "O Indeciso Estratégico",
      description:
        "Você tem o ativo mais difícil de construir: uma trajetória sólida. O que falta não é experiência — é a estrutura para transformar isso em uma oferta que o mercado entende, compara e contrata.",
      color: "from-blue-500 to-blue-600",
      icon: "",
    },
    B: {
      code: "B",
      label: "O Consultor Iniciante",
      description:
        "Você já deu os primeiros passos e provou que tem demanda. O que trava o crescimento não é capacidade técnica — é estrutura para ir além das indicações e criar consistência.",
      color: "from-emerald-500 to-emerald-600",
      icon: "",
    },
    C: {
      code: "C",
      label: "O Frustrado Recente",
      description:
        "Você já tentou e sabe o que não funciona — e isso é vantagem. O próximo passo não é recomeçar do zero, mas reorganizar com método o que já existe.",
      color: "from-purple-500 to-purple-600",
      icon: "",
    },
  };

  return map[profile];
};

export const getRecommendationsForProfile = (
  profile: ProfileCode
): string[] => {
  const map: Record<ProfileCode, string[]> = {
    A: [
      "Transforme sua trajetória executiva em uma oferta de alto valor (pilar Modelagem)",
      "Construa autoridade antes de entrar — não depois de meses tentando (pilar Autoridade)",
      "Estruture seu ponto de partida com método, não por tentativa e erro",
    ],
    B: [
      "Posicione sua oferta para justificar honorários compatíveis com sua expertise (pilar Autoridade)",
      "Crie um motor de prospecção que vá além de indicações (pilar Prospecção)",
      "Estabeleça previsibilidade — projetos que chegam por processo, não por acaso",
    ],
    C: [
      "Diagnostique se o gargalo está na oferta ou na execução (pilar Execução)",
      "Reorganize o que já existe com método — sem começar do zero",
      "Crie consistência na entrega e gere recorrência com seus clientes",
    ],
  };

  return map[profile];
};

export const getAnswerLabel = (
  questionId: string,
  answerValue?: string | string[]
): string => {
  if (!answerValue) return "Não respondido";

  const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
  if (!question || !question.options) return String(answerValue);

  if (Array.isArray(answerValue)) {
    return answerValue
      .map(val => {
        const opt = question.options?.find(o => o.value === val);
        return opt ? opt.label : val;
      })
      .join(", ");
  }

  const option = question.options.find(o => o.value === answerValue);
  return option ? option.label : String(answerValue);
};
