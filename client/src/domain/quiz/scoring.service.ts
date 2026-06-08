// Re-exporta a lógica de scoring compartilhada (fonte única da verdade).
// O cliente usa para exibir o resultado na hora; o servidor recalcula a partir
// do mesmo módulo antes de persistir.
export {
  calculateConsultingScore,
  determineProfile,
} from "@shared/quiz/scoring";
