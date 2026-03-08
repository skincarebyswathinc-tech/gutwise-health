import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { questions, calculateScores } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Leaf, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Assessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = questions[current];
  const progress = ((current + (answers[question?.key] ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const scores = calculateScores(answers);

    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        score_overall: scores.overall,
        score_inflammation: scores.inflammation,
        score_digestion: scores.digestion,
        score_microbiome: scores.microbiome,
      })
      .select()
      .single();

    if (assessmentError || !assessment) {
      toast({ title: 'Error', description: assessmentError?.message || 'Failed to save assessment', variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    const answerRows = Object.entries(answers).map(([key, value]) => ({
      assessment_id: assessment.id,
      question_key: key,
      answer_value: value,
    }));

    const { error: answersError } = await supabase.from('assessment_answers').insert(answerRows);

    if (answersError) {
      toast({ title: 'Error', description: answersError.message, variant: 'destructive' });
    }

    setSubmitting(false);
    navigate('/dashboard');
  };

  const isLast = current === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.key]);

  const categoryLabel: Record<string, string> = {
    inflammation: 'Inflammation',
    digestion: 'Digestion',
    microbiome: 'Microbiome',
    general: 'Lifestyle',
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b bg-card/50 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">Gut Health Assessment</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {current + 1} of {questions.length}</span>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {categoryLabel[question.category]}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {question.question}
          </h2>
        </div>

        <div className="mb-8 space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full rounded-xl border-2 px-5 py-4 text-left transition-all ${
                answers[question.key] === option.value
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'border-border bg-card text-card-foreground hover:border-primary/30'
              }`}
            >
              <span className="text-base font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={current === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {isLast ? (
            <Button
              variant="wellness"
              size="lg"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? 'Saving...' : 'See my results'}
            </Button>
          ) : (
            <Button
              variant="wellness"
              onClick={handleNext}
              disabled={!answers[question.key]}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
