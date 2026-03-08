import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Shield, Activity, Brain } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold text-foreground">Gut Intelligence</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
            <Button variant="wellness" asChild><Link to="/signup">Get started</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center md:py-32">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mx-auto mb-6 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
          Understand your gut, transform your health
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          Take a science-backed assessment to discover your gut health score, inflammation markers, and personalized recommendations.
        </p>
        <Button variant="wellness" size="lg" className="px-10 text-base" asChild>
          <Link to="/signup">Start free assessment</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="border-t bg-card/30 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-foreground">
            What we analyze
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Inflammation', desc: 'Detect signs of chronic inflammation through diet, skin, and joint health indicators.' },
              { icon: Activity, title: 'Digestion Quality', desc: 'Evaluate your digestive regularity, food sensitivities, and acid reflux patterns.' },
              { icon: Brain, title: 'Microbiome Diversity', desc: 'Assess your probiotic intake, fiber consumption, and antibiotic history.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Gut Intelligence Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
