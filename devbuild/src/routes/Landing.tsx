import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ensureUserDoc } from "@/lib/firestore";
import { Code, Rocket, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import logoPng from "@/assets/logo.png";

export default function Landing() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOutUser } = useAuth();
  async function handleSignIn() {
    await signInWithGoogle();
    // best-effort ensure user doc
    if (user?.uid) {
      await ensureUserDoc(user.uid, { displayName: user.displayName ?? undefined, email: user.email ?? undefined });
    }
  }
  // spotlight mouse position
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(20);
  const spotlightStyle = useMemo(
    () => ({
      background:
        `radial-gradient(600px 300px at ${mx}% ${my}%, oklch(0.35 0 0 / .35), transparent 60%)`,
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
      {/* Animated gradient beams */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rotate-12 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[480px] w-[880px] -rotate-12 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-fuchsia-500/10 blur-3xl" />
      {/* Spotlight follows mouse */}
      <div className="pointer-events-none absolute inset-0 transition-[background]" style={spotlightStyle} />

      {/* HERO */}
      <section className="relative grid place-items-center text-center px-6 py-16 md:py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Developer internship simulator
          </div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-foreground/10 bg-white/90 shadow-lg">
            <img src={logoPng} alt="Logo" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Build skills like a real dev</h1>
          <p className="text-muted-foreground text-lg">
            Ship tasks, fix bugs, and earn XP with in-browser coding, realistic tickets, and instant feedback.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate("/app/dashboard")}>Get Started</Button>
            <Button variant="outline" onClick={() => navigate("/app/tasks")}>Browse Tasks</Button>
            {user ? (
              <Button variant="ghost" onClick={signOutUser}>Sign out</Button>
            ) : (
              <Button variant="ghost" onClick={handleSignIn}>Sign in</Button>
            )}
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="rounded-md border border-foreground/10 bg-background/60 px-3 py-2">No setup</div>
            <div className="rounded-md border border-foreground/10 bg-background/60 px-3 py-2">Monaco editor</div>
            <div className="rounded-md border border-foreground/10 bg-background/60 px-3 py-2">XP & Levels</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-6xl mx-auto p-6 md:p-10">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={<Rocket className="size-4" />} title="Real tickets" desc="User stories with acceptance criteria and clarifications via Inbox." />
          <FeatureCard icon={<Code className="size-4" />} title="In-browser coding" desc="Multi-file Monaco editor with autosave and instant checks." />
          <FeatureCard icon={<ShieldCheck className="size-4" />} title="Feedback & XP" desc="Static checks, optional AI review, scores and progress." />
        </div>
      </section>

      {/* PREVIEW CARD */}
      <section className="relative max-w-5xl mx-auto p-6 md:p-10">
        <div className="rounded-xl border border-foreground/10 bg-background/60 backdrop-blur p-4 md:p-6">
          <div className="text-sm text-muted-foreground mb-3">Preview</div>
          <div className="rounded-lg border border-foreground/10 bg-black/40 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
            {`// Acceptance Criteria\n- preventDefault\n- email must include '@'\n- aria-live error region\n\nfunction handleSubmit(e) {\n  e.preventDefault();\n  if (!email.includes('@')) { announce('Invalid email'); return; }\n  // ...continue\n}`}
          </div>
        </div>
      </section>
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


