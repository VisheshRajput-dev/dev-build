import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getRecentSubmissions } from "@/lib/firestore";

export default function History() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const all = await getRecentSubmissions(user.uid, 50);
      setSubs(all);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground text-sm">Your past submissions</p>
      </header>
      <div className="rounded-xl border bg-background/60 backdrop-blur divide-y">
        {loading ? (
          <div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>
        ) : subs.map((s) => (
          <div key={s.id} className="px-4 py-4 text-sm flex items-center justify-between">
            <div>
              <div className="font-medium">{s.taskId}</div>
              <div className="text-xs text-muted-foreground">{new Date(s.createdAt?.toDate?.() ?? Date.now()).toLocaleString()}</div>
            </div>
            <div className="text-muted-foreground">Score {s.score}</div>
          </div>
        ))}
        {!loading && !subs.length && <div className="px-4 py-6 text-sm text-muted-foreground">No submissions yet.</div>}
      </div>
    </div>
  );
}


