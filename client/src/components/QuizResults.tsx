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
import { Download, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { useExitIntent } from "@/hooks/useExitIntent";
import { QuizAnswers, ProfileCode } from "@/domain/quiz/types";
import {
  getResultContent,
  MATURITY_SEGMENTS,
} from "@/domain/quiz/result-content";

interface QuizResultsProps {
  answers: QuizAnswers;
  profile: ProfileCode;
  category: {
    label: string;
    description: string;
    color: string;
    icon: string;
  };
}

const label = "text-[11px] uppercase tracking-[0.18em] text-muted-foreground";

export default function QuizResults({
  answers,
  profile,
  category,
}: QuizResultsProps) {
  const content = getResultContent(profile);

  const rawName = (answers.name as string) || "";
  const firstName = rawName.trim()
    ? rawName.trim().split(" ")[0].charAt(0).toUpperCase() +
      rawName.trim().split(" ")[0].slice(1).toLowerCase()
    : "Você";

  const [reserved, setReserved] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  const handleReserve = () => {
    setReserved(true);
    setShowExitModal(false);
    toast.success("Redirecionando para os próximos passos...");
  };

  const handlePrint = () => window.print();

  useExitIntent({
    enabled: !reserved,
    onExitIntent: () => setShowExitModal(true),
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border">
        <div className="container max-w-5xl flex items-center justify-between gap-4 py-4">
          <span className={label}>
            Ecossistema Fábio Fontanela · Encontro Estratégico · Junho 2026
          </span>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="shrink-0 border-primary/40 text-primary hover:bg-primary/10 text-xs print:hidden"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Salvar em PDF
          </Button>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="container max-w-3xl space-y-14 py-12 md:py-16"
      >
        <motion.header variants={itemVariants} className="text-center">
          <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-primary/80">
            Seu estágio · Ecossistema Fontanela
          </p>
          <div className="mx-auto mb-6 h-3.5 w-3.5 rounded-full bg-primary" />
          <h1 className="mb-3 font-serif text-5xl text-foreground md:text-6xl">
            {category.label}
          </h1>
          <p className="mb-6 font-serif text-lg italic text-primary/90">
            {content.subtitle}
          </p>
          <div className="mx-auto mb-6 h-px w-12 bg-border" />
          <p className="mx-auto max-w-2xl font-serif text-base italic leading-relaxed text-muted-foreground md:text-lg">
            {content.intro}
          </p>
        </motion.header>

        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
          <Card className="border-y border-r border-l-2 border-border border-l-primary bg-card/40 p-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-primary/80">
              O que esse estágio revela
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {content.reveals}
            </p>
          </Card>

          <Card className="border border-border bg-card/40 p-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              A tensão central do seu momento
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {content.tension}
            </p>
          </Card>

          <Card className="border border-border bg-card/40 p-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Sinais que confirmam esse estágio
            </p>
            <ul className="space-y-2">
              {content.signals.map(signal => (
                <li
                  key={signal}
                  className="flex gap-2 text-sm leading-relaxed text-foreground/90"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {signal}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-y border-r border-l-2 border-border border-l-primary bg-card/40 p-6">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-primary/80">
              O acelerador prioritário agora
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {content.accelerator}
            </p>
          </Card>
        </motion.div>

        <motion.section variants={itemVariants}>
          <p className={`mb-6 text-center ${label}`}>
            O que o Encontro abre para você
          </p>
          <div className="space-y-3">
            {content.opportunities.map((opportunity, index) => (
              <div
                key={opportunity}
                className="flex items-center gap-4 rounded-lg border border-border bg-card/40 px-5 py-4"
              >
                <span className="font-semibold text-sm text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90 md:text-base">
                  {opportunity}
                </span>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-card/20 px-5 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {content.focusNote}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-xl border border-border bg-card/40 p-6 md:p-8"
        >
          <p className={`mb-5 text-center ${label}`}>
            Régua de maturidade consultiva
          </p>
          <div className="mb-3 flex gap-1.5">
            {Array.from({ length: MATURITY_SEGMENTS }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index < content.maturityFill ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Pré-entrada</span>
            <span>Em estruturação</span>
            <span>Consolidado</span>
          </div>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {content.maturityNote}
          </p>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-lg border-y border-r border-l-2 border-border border-l-primary bg-card/40 px-6 py-5"
        >
          <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            O próximo passo antes do Encontro
          </p>
          <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
            {content.nextStep}
          </p>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-xl bg-primary p-6 text-primary-foreground md:p-8"
        >
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] opacity-70">
            Próximo passo
          </p>
          <h3 className="mb-1 font-serif text-2xl md:text-3xl">
            Encontro com Fábio Fontanela
          </h3>
          <p className="mb-5 text-sm opacity-80">
            2 de julho · 20h · Ao vivo · Gratuito
          </p>
          <Button
            onClick={handleReserve}
            className="w-full bg-background py-6 text-base font-bold text-foreground hover:bg-background/90"
          >
            Quero garantir minha vaga
          </Button>
        </motion.section>

        <motion.div variants={itemVariants} className="text-center print:hidden">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-2 border-border px-8 py-5 text-base hover:bg-muted"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar meu resultado
          </Button>
        </motion.div>
      </motion.div>

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
              className="w-full border-2 border-primary bg-primary py-6 text-lg font-bold text-primary-foreground hover:bg-primary/90"
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
