import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Award, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface QuizResultsProps {
  answers: Record<string, any>;
  score: number;
  category: {
    label: string;
    description: string;
    color: string;
    icon: string;
  };
}

export default function QuizResults({ answers, score, category }: QuizResultsProps) {
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

  const handleSendResults = () => {
    // Aqui você pode enviar os dados para um backend
    console.log('Quiz responses:', { ...answers, score, category: category.label });
    toast.success('Seus resultados foram registrados!');
  };

  const handleRestart = () => {
    window.location.reload();
  };

  // Determinar ícone baseado na categoria
  const getCategoryIcon = () => {
    switch (category.label) {
      case 'Especialista em Cargo CLT':
        return <Award className="w-16 h-16" />;
      case 'Especialista em Transição':
        return <TrendingUp className="w-16 h-16" />;
      case 'Consultor Iniciante':
        return <Zap className="w-16 h-16" />;
      default:
        return <CheckCircle2 className="w-16 h-16" />;
    }
  };

  const getRecommendations = () => {
    if (score <= 30) {
      return [
        'Comece a documentar sua experiência e expertise',
        'Identifique seu primeiro nicho de mercado',
        'Crie um plano de transição de 6-12 meses',
      ];
    } else if (score <= 50) {
      return [
        'Defina sua proposta de valor com clareza',
        'Estruture seu primeiro projeto piloto',
        'Crie um processo de prospecção ativo',
      ];
    } else if (score <= 70) {
      return [
        'Implemente um sistema de gestão de clientes',
        'Crie processos repetíveis e escaláveis',
        'Desenvolva autoridade no seu nicho',
      ];
    } else {
      return [
        'Otimize sua precificação e margem',
        'Crie ofertas premium e recorrentes',
        'Estruture um modelo de negócio previsível',
      ];
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          {/* Score Display */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
                className="inline-flex mb-6 text-primary"
              >
                {getCategoryIcon()}
              </motion.div>

              <h2 className="neo-display text-5xl md:text-6xl mb-4">
                {score}
                <span className="text-3xl text-muted-foreground">/100</span>
              </h2>

              <p className="text-muted-foreground mb-2">Seu Score de Consultoria</p>
            </div>
          </motion.div>

          {/* Category Card */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className={`border-2 border-primary bg-gradient-to-br ${category.color} bg-opacity-10 backdrop-blur-sm p-8 md:p-12 neo-card shadow-lg`}>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-6xl mb-4"
                >
                  {category.icon}
                </motion.div>

                <h3 className="neo-heading text-3xl md:text-4xl mb-3 text-foreground">
                  {category.label}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div variants={itemVariants} className="mb-8">
            <h4 className="neo-heading text-2xl mb-4">Análise Detalhada</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience */}
              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Experiência</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {answers.experience === 'less-10' && 'Menos de 10 anos'}
                  {answers.experience === '10-15' && 'Entre 10 e 15 anos'}
                  {answers.experience === '15-20' && 'Entre 15 e 20 anos'}
                  {answers.experience === 'more-20' && 'Mais de 20 anos'}
                </p>
              </Card>

              {/* Moment */}
              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-semibold">Momento Atual</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {answers.moment === 'considering' && 'Considerando transição'}
                  {answers.moment === 'transitioning' && 'Em transição'}
                  {answers.moment === 'started' && 'Já iniciou'}
                  {answers.moment === 'established' && 'Já estruturado'}
                </p>
              </Card>

              {/* Clarity */}
              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="font-semibold">Clareza de Oferta</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {answers.clarity === 'clear' && 'Totalmente claro'}
                  {answers.clarity === 'partial' && 'Parcialmente claro'}
                  {answers.clarity === 'unclear' && 'Ainda não definido'}
                </p>
              </Card>

              {/* Clients */}
              <Card className="border-2 border-border bg-card/50 p-4 neo-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Carteira de Clientes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {answers.clients === 'none' && 'Nenhum ainda'}
                  {answers.clients === 'pontual' && 'Projetos pontuais'}
                  {answers.clients === 'irregular' && 'Irregular'}
                  {answers.clients === 'stable' && 'Estável'}
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div variants={itemVariants} className="mb-8">
            <h4 className="neo-heading text-2xl mb-4">Próximos Passos Recomendados</h4>

            <div className="space-y-3">
              {getRecommendations().map((rec, index) => (
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
                  <p className="text-base leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-4">
              ✓ Seus resultados foram salvos com sucesso! Você receberá em breve um email com:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Análise detalhada do seu perfil</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>Recomendações personalizadas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Acesso antecipado à masterclass</span>
              </li>
            </ul>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={handleRestart}
              variant="outline"
              className="border-2 border-border hover:bg-card/50"
            >
              Fazer Novo Diagnóstico
            </Button>
            <Button
              onClick={handleSendResults}
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary font-bold"
            >
              Confirmar e Receber Resultados
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>
              Dúvidas? Entre em contato conosco em 
              <a href="mailto:contato@mape.com.br" className="text-primary hover:underline ml-1">
                contato@mape.com.br
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
