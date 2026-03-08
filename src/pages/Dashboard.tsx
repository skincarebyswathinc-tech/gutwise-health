import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getRecommendations } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import ScoreRing from '@/components/ScoreRing';
import { Leaf, LogOut, ClipboardList, Lightbulb, TrendingUp } from 'lucide-react';

interface Assessment {
  id: string;
  score_overall: number;
  score_inflammation: number;
  score_digestion: number;
  score_microbiome: number;
  completed_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setAssessment(data[0] as Assessment);
        setLoading(false);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse font-display text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  const recommendations = assessment
    ? getRecommendations({
        overall: assessment.score_overall,
        inflammation: assessment.score_inflammation,
        digestion: assessment.score_digestion,
        microbiome: assessment.score_microbiome,
      })
    : [];

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs attention';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">Gut Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!assessment ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
              <ClipboardList className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-3 font-display text-3xl font-semibold text-foreground">
              Start your gut health assessment
            </h1>
            <p className="mb-8 max-w-md text-muted-foreground">
              Answer a series of questions about your diet, digestion, and lifestyle to receive personalized gut health insights.
            </p>
            <Button variant="wellness" size="lg" onClick={() => navigate('/assessment')}>
              Begin assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="rounded-2xl border bg-card p-6 text-center md:p-8">
              <h1 className="mb-1 font-display text-2xl font-semibold text-foreground">Your Gut Health Score</h1>
              <p className="mb-6 text-muted-foreground">
                Based on your latest assessment • {new Date(assessment.completed_at).toLocaleDateString()}
              </p>
              <div className="flex justify-center">
                <ScoreRing score={assessment.score_overall} label={getScoreLabel(assessment.score_overall)} size={160} />
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border bg-card p-6">
                <ScoreRing score={assessment.score_inflammation} label="Inflammation" size={100} />
              </div>
              <div className="flex flex-col items-center rounded-2xl border bg-card p-6">
                <ScoreRing score={assessment.score_digestion} label="Digestion" size={100} />
              </div>
              <div className="flex flex-col items-center rounded-2xl border bg-card p-6">
                <ScoreRing score={assessment.score_microbiome} label="Microbiome" size={100} />
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Recommendations</h2>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <div key={i} className="rounded-xl bg-accent/50 p-4">
                    <h3 className="mb-1 font-medium text-foreground">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Retake */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <p className="text-center text-muted-foreground">Want to track your progress?</p>
              <Button variant="wellness" onClick={() => navigate('/assessment')}>
                Retake assessment
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
