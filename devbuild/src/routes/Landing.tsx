import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ensureUserDoc } from "@/lib/firestore";

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
  return (
    <main className="min-h-svh p-6 flex flex-col gap-16">
      <section className="grid place-items-center text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">RealDesk</h1>
          <p className="text-muted-foreground text-lg">
            Practice real developer work: tickets, code, AI feedback, and XP. A mini internship in your browser.
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
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard title="Real tickets" desc="User stories, acceptance criteria, and clarifications via Inbox." />
          <FeatureCard title="In-browser coding" desc="Monaco editor with multi-file tabs and autosave." />
          <FeatureCard title="Feedback & XP" desc="Static checks, optional AI review, scores and levels." />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-md border p-5 text-left space-y-2">
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}


