import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getFirebase } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getRecentSubmissions } from "@/lib/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { db } = getFirebase();
      const uref = doc(db, "users", user.uid);
      const usnap = await getDoc(uref);
      if (usnap.exists()) {
        const d = usnap.data() as any;
        setXp(d.xp ?? 0);
        setLevel(d.level ?? 1);
      }
      const subs = await getRecentSubmissions(user.uid, 5);
      setRecent(subs);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome{user?.displayName ? `, ${user.displayName}` : ''}</h1>
        <p className="text-muted-foreground">Track your progress and continue practicing.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Level" value={String(level)} subtitle="+500 XP per level" />
        <StatCard title="XP" value={String(xp)} subtitle="Earn XP by submitting tasks" />
        <StatCard title="Recent" value={String(recent.length)} subtitle="Last 5 submissions" />
      </section>

      <section className="rounded-xl border bg-background/60 backdrop-blur overflow-hidden">
        <div className="px-4 py-3 border-b font-medium">Recent submissions</div>
        {loading ? (
          <div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>
        ) : recent.length ? (
          recent.map((r) => (
            <div key={r.id} className="px-4 py-3 text-sm flex items-center justify-between border-b last:border-b-0">
              <div>
                <div className="font-medium">{r.taskId}</div>
                <div className="text-xs text-muted-foreground">{new Date(r.createdAt?.toDate?.() ?? Date.now()).toLocaleString()}</div>
              </div>
              <span className="text-muted-foreground">Score {r.score}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-sm text-muted-foreground">No submissions yet.</div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-xl border bg-background/60 backdrop-blur p-5">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-3xl font-bold leading-tight">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}


