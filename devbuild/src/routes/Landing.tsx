import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ensureUserDoc } from "@/lib/firestore";
import { Code, Rocket, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import logoPng from "@/assets/logo.png";
import bgWebp from "@/assets/bgg.webp";

export default function Landing() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  async function handleSignIn() {
    await signInWithGoogle();
    // best-effort ensure user doc
    if (user?.uid) {
      await ensureUserDoc(user.uid, { displayName: user.displayName ?? undefined, email: user.email ?? undefined });
    }
  }
  // subtle parallax spotlight
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(30);
  const spotlightStyle = useMemo(
    () => ({
      background: `radial-gradient(600px 320px at ${mx}% ${my}%, rgba(255,255,255,.10), transparent 60%)`,
    }),
    [mx, my]
  );

  return (
    <main
      className="min-h-svh relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMx(((e.clientX - rect.left) / rect.width) * 100);
        setMy(((e.clientY - rect.top) / rect.height) * 100);
      }}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgWebp})` }}
        aria-hidden
      />
      {/* Dark overlay + spotlight */}
      <div className="absolute inset-0 -z-10 bg-black/70" />
      <div className="absolute inset-0 -z-10 transition-[background]" style={spotlightStyle} />

      {/* HERO */}
      <section className="relative grid place-items-center text-center px-6 py-16 md:py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1 text-xs text-white/70">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Developer internship simulator
          </div>
          <img src={logoPng} alt="Logo" className="mx-auto h-24 w-24 object-contain" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Build skills like a real dev</h1>
          <p className="text-white/70 text-lg">
            Ship tasks, fix bugs, and earn XP with in-browser coding, realistic tickets, and instant feedback.
          </p>
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              className="px-8 py-6 text-base md:text-lg"
              onClick={() => (user ? navigate("/app/dashboard") : handleSignIn())}
            >
              Get Started
            </Button>
          </div>
          {/* chips removed per request */}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-6xl mx-auto p-6 md:p-10 -mt-6 md:-mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={<Rocket className="size-4" />} title="Real tickets" desc="User stories with acceptance criteria and clarifications via Inbox." />
          <FeatureCard icon={<Code className="size-4" />} title="In-browser coding" desc="Multi-file Monaco editor with autosave and instant checks." />
          <FeatureCard icon={<ShieldCheck className="size-4" />} title="Feedback & XP" desc="Static checks, optional AI review, scores and progress." />
        </div>
      </section>

      {/* preview removed per request */}
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md border p-5 text-left space-y-2 bg-background/60 backdrop-blur">
      <div className="flex items-center gap-2 font-semibold">
        {icon && <span className="inline-flex items-center justify-center rounded-md border size-6 text-xs opacity-80">{icon}</span>}
        {title}
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}


