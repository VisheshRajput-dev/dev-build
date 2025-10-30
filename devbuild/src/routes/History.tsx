import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getRecentSubmissions } from "@/lib/firestore";

export default function History() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const all = await getRecentSubmissions(user.uid, 50);
      setSubs(all);
    }
    load();
  }, [user]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">History</h2>
      <div className="rounded-md border divide-y">
        {subs.map((s) => (
          <div key={s.id} className="px-4 py-3 text-sm flex items-center justify-between">
            <div>
              <div className="font-medium">{s.taskId}</div>
              <div className="text-xs text-muted-foreground">{new Date(s.createdAt?.toDate?.() ?? Date.now()).toLocaleString()}</div>
            </div>
            <div className="text-muted-foreground">Score {s.score}</div>
          </div>
        ))}
        {!subs.length && <div className="px-4 py-6 text-sm text-muted-foreground">No submissions yet.</div>}
      </div>
    </div>
  );
}


