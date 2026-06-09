import { ProfileCode } from "./types";

export interface ResultContent {
  subtitle: string;
  intro: string;
  reveals: string;
  tension: string;
  signals: string[];
  accelerator: string;
  opportunities: string[];
  focusNote: string;
  maturityFill: number;
  maturityNote: string;
  nextStep: string;
}

const CONTENT: Record<ProfileCode, ResultContent> = {
  A: {
    subtitle: "A trajetória existe. A estrutura de entrada, ainda não.",
    intro:
      "Você tem o ativo mais difícil de construir: anos de trajetória real. O que falta não é experiência — é o método que transforma isso em uma oferta que o mercado entende, compara e contrata.",
    reveals:
      "Você sabe o que entrega, mas ainda não tem uma estrutura que traduza sua trajetória em uma oferta clara de mercado. Decidir estruturar a entrada — antes de dar o passo — é o que define se ela será organizada ou caótica.",
    tension:
      "A tensão central do seu momento é a distância entre o que você sabe que vale e o que o mercado ainda não consegue reconhecer. Não é falta de competência — é ausência de uma arquitetura que torne a sua expertise legível para quem decide contratar.",
    signals: [
      "Sabe que tem repertório para atuar, mas ainda não deu o passo",
      "Dificuldade de nomear o que faz como uma oferta de mercado",
      "Insegurança sobre como precificar e posicionar a trajetória",
      "Os primeiros projetos dependeriam só da rede que você já tem",
    ],
    accelerator:
      "Modelagem da oferta e Autoridade. Antes de qualquer ação comercial, você precisa de uma oferta que o mercado leia sem contexto — e de autoridade construída antes de entrar, não depois de meses tentando.",
    opportunities: [
      "Como transformar trajetória em uma oferta clara — que o mercado contrata sem precisar de explicação",
      "Como posicionar e precificar compatível com o nível do que você realmente entrega",
      "Como estruturar a entrada no mercado com método — sem tentativa e erro",
    ],
    focusNote:
      "Profissionais no seu momento extraem mais focando em M (Modelagem) e A (Autoridade) — os fundamentos que definem se a entrada será estruturada ou improvisada.",
    maturityFill: 1,
    maturityNote:
      "Você está nos primeiros estágios — onde a decisão de estruturar a entrada com método define tudo que vem depois.",
    nextStep:
      "Você não precisa recomeçar do zero — já tem o repertório. O que falta é o método que organiza o ponto de partida e transforma anos de experiência em algo que o mercado consegue ler, comparar e contratar.",
  },
  B: {
    subtitle: "Os primeiros clientes vieram. A consistência, ainda não.",
    intro:
      "Você já deu os primeiros passos e provou que tem demanda. O que trava o crescimento não é capacidade técnica — é estrutura para ir além das indicações e criar previsibilidade.",
    reveals:
      "Você entrega resultado e já conquistou clientes — em geral por indicação. O que falta é a estrutura que transforma resultado esporádico em algo previsível, com aquisição que não depende só de quem você conhece.",
    tension:
      "A tensão central do seu momento é depender da rede existente. Os projetos chegam, mas sem método e sem regularidade — e os honorários ficam abaixo do que a sua expertise justificaria, porque o mercado não lê o seu valor antes da conversa.",
    signals: [
      "Clientes chegam por indicação, mas sem regularidade",
      "Honorários abaixo do que a expertise justificaria",
      "Tudo depende da sua presença direta em cada projeto",
      "Falta previsibilidade na entrada de novos projetos",
    ],
    accelerator:
      "Autoridade e Prospecção. É o que transforma esforço disperso em resultado consistente: posicionamento que justifica honorários maiores e um motor de aquisição que vai além da indicação.",
    opportunities: [
      "Como ir além dos clientes que chegam por indicação",
      "Como posicionar e precificar compatível com o que você entrega",
      "Como criar previsibilidade — projetos que chegam por processo, não por acaso",
    ],
    focusNote:
      "Para o seu momento, os pilares com maior retorno imediato são A (Autoridade) e P (Prospecção) — os que transformam esforço disperso em resultado consistente.",
    maturityFill: 3,
    maturityNote:
      "Você já está em estruturação — o foco agora é ganhar previsibilidade e sair da dependência de indicação.",
    nextStep:
      "Você já está em movimento. O que falta é o método que transforma o que você já faz em um negócio com previsibilidade e honorários compatíveis com a sua trajetória.",
  },
  C: {
    subtitle: "Você já tentou. E sabe que algo não fechou.",
    intro:
      "Você já tentou e sabe o que não funciona — e isso é vantagem. O próximo passo não é recomeçar do zero, mas reorganizar, com método, o que já existe.",
    reveals:
      "Você saiu do corporativo, testou o mercado e conquistou alguns clientes — mas sem a consistência esperada. O que falta não é voltar ao início: é colocar estrutura no que você já construiu.",
    tension:
      "A tensão central do seu momento é a sensação de que algo não funciona como deveria, sem conseguir identificar exatamente o quê. Quase nunca é falta de esforço ou de experiência — é ausência de estrutura desde o começo.",
    signals: [
      "Conseguiu clientes, mas de forma irregular",
      "Resultados não vieram com a consistência esperada",
      "Sensação de estar trabalhando mais do que o retorno",
      "Algo não encaixou — mas não está claro o quê",
    ],
    accelerator:
      "Execução. É onde o diagnóstico fica mais claro — revela se o problema está na oferta, na entrega ou na falta de método para gerar recorrência, e organiza o que já existe.",
    opportunities: [
      "O que exatamente travou os resultados até agora",
      "O que precisa ser reorganizado — sem começar do zero",
      "Como dar estrutura ao que já existe para o mercado entender e contratar",
    ],
    focusNote:
      "O pilar E (Execução) do MAPE é onde o diagnóstico fica mais claro — mostra se o gargalo está na entrega, na oferta ou na geração de recorrência.",
    maturityFill: 2,
    maturityNote:
      "Você já tentou e tem referências do que funciona — agora é reorganizar o que existe com método.",
    nextStep:
      "Não é recomeçar do zero. É colocar estrutura no que você já tentou — com um método que organiza o que faltou e transforma a sua experiência em algo previsível.",
  },
};

export const getResultContent = (profile: ProfileCode): ResultContent =>
  CONTENT[profile];

export const MATURITY_SEGMENTS = 6;
