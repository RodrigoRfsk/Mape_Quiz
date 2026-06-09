import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, Award, Zap, TrendingUp, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { useExitIntent } from "@/hooks/useExitIntent";
import { QuizAnswers, ProfileCode } from "@/domain/quiz/types";
import {
  getRecommendationsForProfile,
  getAnswerLabel,
} from "@/domain/quiz/data";

interface QuizResultsProps {
  answers: QuizAnswers;
  score: number;
  profile: ProfileCode;
  category: {
    label: string;
    description: string;
    color: string;
    icon: string;
  };
  onRestart: () => void;
}

export default function QuizResults({
  answers,
  score,
  profile,
  category,
  onRestart,
}: QuizResultsProps) {
  const rawName = (answers.name as string) || "";
  const firstName = rawName.trim()
    ? rawName.trim().split(" ")[0].charAt(0).toUpperCase() +
      rawName.trim().split(" ")[0].slice(1).toLowerCase()
    : "Você";

  const personalizeText = (text: string) => {
    if (!rawName.trim()) return text;
    return text.replace(/\bvocê\b/gi, firstName);
  };

  const isPrimaryFocus = profile === "A";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const [reserved, setReserved] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  const handleReserve = () => {
    setReserved(true);
    setShowExitModal(false);
    toast.success("Redirecionando para os próximos passos...");
  };

  useExitIntent({
    enabled: !reserved,
    onExitIntent: () => setShowExitModal(true),
  });

  const getCategoryIcon = () => {
    switch (profile) {
      case "A":
        return <Award className="w-16 h-16" />;
      case "B":
        return <Zap className="w-16 h-16" />;
      case "C":
        return <TrendingUp className="w-16 h-16" />;
      default:
        return <CheckCircle2 className="w-16 h-16" />;
    }
  };

  const recommendations = getRecommendationsForProfile(profile);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
                className="inline-flex mb-6 text-primary"
              >
                {getCategoryIcon()}
              </motion.div>

              <h2 className="neo-display text-5xl md:text-6xl mb-4 text-primary">
                {score}
                <span className="text-3xl text-muted-foreground ml-1">
                  /100
                </span>
              </h2>

              <p className="text-muted-foreground mb-2">
                Score de Consultoria de {firstName}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <Card
              className={`relative overflow-hidden border-2 backdrop-blur-sm p-8 md:p-12 neo-card shadow-lg transition-colors ${
                isPrimaryFocus
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50"
              }`}
            >
              <div
                className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                  isPrimaryFocus ? "bg-primary/20" : "bg-muted/20"
                }`}
              />

              <div className="relative text-center z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`text-6xl mb-4 ${
                    isPrimaryFocus ? "text-primary" : ""
                  }`}
                >
                  {category.icon}
                </motion.div>

                <h3 className="neo-heading text-3xl md:text-4xl mb-3 text-foreground">
                  {category.label}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {personalizeText(category.description)}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h4 className="neo-heading text-2xl mb-4">Análise Detalhada</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Experiência</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getAnswerLabel("experience", answers.experience)}
                </p>
              </Card>

              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-semibold">Momento Atual</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getAnswerLabel("moment", answers.moment)}
                </p>
              </Card>

              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="font-semibold">Clareza de Oferta</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getAnswerLabel("clarity", answers.clarity)}
                </p>
              </Card>

              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Carteira de Clientes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getAnswerLabel("clients", answers.clients)}
                </p>
              </Card>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h4 className="neo-heading text-2xl mb-4">
              Próximos Passos Recomendados
            </h4>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 border-2 border-border rounded-lg bg-card/50 neo-card"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-base leading-relaxed">
                    {personalizeText(rec)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-primary/10 border border-primary/30 rounded-lg p-8 mb-8 text-center"
          >
            <p className="text-2xl md:text-3xl font-black text-primary mb-4">
              Seu diagnóstico mostrou seu estágio atual.
            </p>

            <p className="text-base text-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Agora é hora de entender como{" "}
              <span className="font-bold text-primary">
                transformar sua experiência em uma consultoria
              </span>{" "}
              que o mercado compreenda, valorize e contrate.
            </p>

            <p className="text-base text-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              Para ajudá-lo nessa jornada, criamos um{" "}
              <span className="font-bold text-primary">
                encontro estratégico exclusivo
              </span>{" "}
              que acontecerá no dia{" "}
              <span className="font-bold text-primary">02 de julho</span>, onde
              você conhecerá os pilares para estruturar sua oferta consultiva e
              fortalecer sua autoridade no mercado.
            </p>

            <p className="text-base font-bold text-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              Clique abaixo e reserve sua vaga gratuitamente:
            </p>

            <Button
              onClick={handleReserve}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold px-10 py-6 text-lg w-full sm:w-auto"
            >
              Quero Reservar Minha Vaga
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <Button
              onClick={onRestart}
              variant="outline"
              className="border-2 border-border hover:bg-muted px-8 py-5 text-base w-full sm:w-auto"
            >
              Refazer diagnóstico
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="border-2 border-primary bg-card sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              {firstName}, não saia sem garantir sua vaga
            </DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed">
              Seu diagnóstico está pronto, mas o próximo passo é o que muda o
              jogo: o encontro estratégico do dia{" "}
              <span className="font-bold text-primary">02 de julho</span> tem
              vagas limitadas e gratuitas. Garanta a sua antes de fechar.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleReserve}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold py-6 text-lg"
            >
              Quero garantir minha vaga
            </Button>
            <Button
              onClick={() => setShowExitModal(false)}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Agora não
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
