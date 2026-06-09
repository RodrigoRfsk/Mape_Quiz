import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

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
            stroke="#ffd700"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
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
      <p className="text-sm text-muted-foreground">
        Cruzando suas respostas com o método MAPE
      </p>
    </div>
  );
}
