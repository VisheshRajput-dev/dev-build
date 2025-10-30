import { useMemo, useState } from "react";
import msgs from "@/data/messages.json";
import tasks from "@/data/tasks.json";

export default function Inbox() {
  const [taskId, setTaskId] = useState<string>("all");
  const filtered = useMemo(() => msgs.filter((m) => taskId === "all" || m.taskId === taskId), [taskId]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Inbox</h2>
          <p className="text-muted-foreground text-sm">Simulated client messages</p>
        </div>
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)} className="h-9 rounded-md border px-3 text-sm bg-background">
          <option value="all">All tasks</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>
      <div className="rounded-md border divide-y">
        {filtered.map((m) => (
          <div key={m.id} className="px-4 py-3 text-sm">
            <div className="text-xs text-muted-foreground">{m.taskId}</div>
            <div>{m.text}</div>
          </div>
        ))}
        {!filtered.length && <div className="px-4 py-6 text-sm text-muted-foreground">No messages.</div>}
      </div>
    </div>
  );
}


