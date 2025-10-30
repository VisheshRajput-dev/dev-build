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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-muted-foreground">Your XP, recent submissions, and streak.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Level" value={String(level)} />
        <Stat label="XP" value={String(xp)} />
        <Stat label="Recent" value={String(recent.length)} />
      </div>
      <div className="rounded-md border">
        <div className="px-4 py-2 border-b font-medium">Recent submissions</div>
        {loading ? (
          <div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>
        ) : recent.length ? (
          recent.map((r) => (
            <div key={r.id} className="px-4 py-2 text-sm flex items-center justify-between border-b last:border-b-0">
              <span>{r.taskId}</span>
              <span className="text-muted-foreground">Score {r.score}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-sm text-muted-foreground">No submissions yet.</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}


