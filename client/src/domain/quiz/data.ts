import { ScoringRules, ProfileCode } from "./types";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  block: number;
  type: "text" | "textarea" | "radio" | "checkbox";
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  optional?: boolean;
  subtext?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: "name",
    block: 1,
    type: "text",
    question: "Qual o seu Primeiro Nome?",
    placeholder: "Digite seu nome",
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
    id: "area",
    block: 1,
    type: "text",
    question: "Qual é a sua área de atuação principal ao longo da carreira?",
    placeholder:
      "Ex: Finanças corporativas, Operações, Estratégia, RH, Tecnologia...",
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
    id: "phone",
    block: 1,
    type: "text",
    question: "Qual é o seu telefone com DDD?",
    placeholder: "(00) 00000-0000",
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
  {
    id: "expected-result",
    block: 4,
    type: "radio",
    question:
      "Qual resultado concreto você espera ter clareza ao sair da do encontro estratégico?",
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
    id: "main-question",
    block: 2,
    type: "text",
    question:
      "Em uma frase, qual é a pergunta que você mais gostaria que o encontro estratégico respondesse?",
    placeholder:
      "Seja específico — essa informação orienta diretamente o conteúdo",
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
    id: "sector",
    block: 3,
    type: "text",
    question:
      "Qual é o setor ou perfil de organização com maior potencial para a sua consultoria?",
    placeholder:
      "Ex: Empresas familiares em processo de profissionalização, indústria de médio porte...",
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
  {
    id: "email",
    block: 1,
    type: "text",
    question: "Qual é o seu melhor email?",
    placeholder: "seu@email.com",
  },
];

export const SCORING_RULES: ScoringRules = {
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

export const getCategoryDisplayData = (profile: ProfileCode) => {
  const map: Record<
    ProfileCode,
    { code: ProfileCode; label: string; description: string; color: string; icon: string }
  > = {
    A: {
      code: "A",
      label: "O Indeciso Estratégico",
      description:
        "Você tem o ativo mais difícil de construir: uma trajetória sólida. O que falta não é experiência — é a estrutura para transformar isso em uma oferta que o mercado entende, compara e contrata.",
      color: "from-blue-500 to-blue-600",
      icon: "💼",
    },
    B: {
      code: "B",
      label: "O Consultor Iniciante",
      description:
        "Você já deu os primeiros passos e provou que tem demanda. O que trava o crescimento não é capacidade técnica — é estrutura para ir além das indicações e criar consistência.",
      color: "from-emerald-500 to-emerald-600",
      icon: "⚡",
    },
    C: {
      code: "C",
      label: "O Frustrado Recente",
      description:
        "Você já tentou e sabe o que não funciona — e isso é vantagem. O próximo passo não é recomeçar do zero, mas reorganizar com método o que já existe.",
      color: "from-purple-500 to-purple-600",
      icon: "🔄",
    },
  };

  return map[profile];
};

export const getRecommendationsForProfile = (profile: ProfileCode): string[] => {
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
