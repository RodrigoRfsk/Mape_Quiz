import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeroProps {
  onStart: () => void;
}

export default function QuizHero({ onStart }: QuizHeroProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex flex-col justify-center">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative diagonal-cut bg-background py-12 sm:py-20 md:py-32 w-full">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Teste - Método MAPE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="neo-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight"
            >
              <span className="block">Nossa IA analisa seu perfil</span>
              <span className="block">e revela se você está preparado</span>
              <span>para transformar sua experiência</span>
              <span className="block mt-2 text-primary">
                em uma consultoria valorizada
              </span>
              <span className="block mt-2 text-primary">
                pelo mercado.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl leading-relaxed text-balance"
            >
              Um teste rápido para revelar seu estágio atual como futuro
              consultor. Identifique oportunidades, lacunas e próximos passos
              para sua evolução.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-8 sm:mb-10"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Tempo estimado: 2 minutos</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>Gratuito</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Respostas confidenciais</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button
                onClick={onStart}
                size="lg"
                className="w-full sm:w-auto px-8 py-5 text-lg sm:px-16 sm:py-6 sm:text-xl md:px-24 md:py-7 md:text-2xl bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold flex items-center justify-center gap-3 group shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
              >
                Análise meu perfil
                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-primary via-secondary to-transparent"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
      </div>
    </div>
  );
}
