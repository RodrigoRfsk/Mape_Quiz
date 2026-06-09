import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Check } from "lucide-react";

const STEPS = [
  "Lendo suas respostas",
  "Processando padrões de comportamento",
  "Cruzando com métricas de mercado",
  "Calibrando o modelo preditivo",
  "Gerando seu diagnóstico",
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface AiAnalysisProps {
  onComplete: () => void;
  durationMs?: number;
}

export default function AiAnalysis({
  onComplete,
  durationMs = 4200,
}: AiAnalysisProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let finished = false;

    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / durationMs) * 100));
      setProgress(pct);

      if (pct < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }

      if (!finished) {
        finished = true;
        window.setTimeout(() => onCompleteRef.current(), 500);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);

  const isStepDone = (index: number) =>
    progress >= ((index + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-8 flex h-44 w-44 items-center justify-center">
        <motion.div
          className="absolute h-40 w-40 rounded-full bg-primary/10 blur-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {[0, 1].map(ring => (
          <motion.span
            key={ring}
            className="absolute h-40 w-40 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: ring * 1.2 }}
          />
        ))}

        <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="url(#aiGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
          <defs>
            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff6b35" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Bot className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="neo-display text-3xl text-foreground">
            {progress}%
          </span>
        </div>
      </div>

      <h3 className="neo-display text-2xl md:text-3xl mb-1 text-foreground">
        Analisando seu perfil com IA
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Cruzando suas respostas com o método MAPE
      </p>

      <div className="w-full max-w-sm space-y-2 text-left">
        {STEPS.map((step, index) => {
          const done = isStepDone(index);
          const active = !done && (index === 0 || isStepDone(index - 1));

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: done || active ? 1 : 0.45, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                done
                  ? "border-primary/40 bg-primary/5"
                  : active
                    ? "border-border bg-muted/30"
                    : "border-transparent"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground"
                }`}
              >
                {done ? (
                  <Check className="h-3 w-3" />
                ) : active ? (
                  <motion.span
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ) : null}
              </span>
              <span
                className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
