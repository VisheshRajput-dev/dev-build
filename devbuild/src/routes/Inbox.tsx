import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import msgs from "@/data/messages.json";
import tasks from "@/data/tasks.json";

export default function Inbox() {
  const [taskId, setTaskId] = useState<string>("all");
  const filtered = useMemo(() => msgs.filter((m) => taskId === "all" || m.taskId === taskId), [taskId]);

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground text-sm">Simulated client messages</p>
        </div>
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)} className="h-9 rounded-md border px-3 text-sm bg-background">
          <option value="all">All tasks</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </header>
      <div className="rounded-xl border bg-background/60 backdrop-blur divide-y">
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-sm text-muted-foreground">No messages.</div>
        )}
        {filtered.map((m) => (
          <div key={m.id} className="px-4 py-4 text-sm flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">{m.taskId}</div>
              <div>{m.text}</div>
            </div>
            <Link className="underline text-xs" to={`/app/tasks/${m.taskId}`}>Open task</Link>
          </div>
        ))}
      </div>
    </div>
  );
}


