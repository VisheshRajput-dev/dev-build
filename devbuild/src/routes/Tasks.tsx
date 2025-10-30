import { Link } from "react-router-dom";
import tasks from "@/data/tasks.json";
import { useMemo, useState } from "react";

export default function Tasks() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tasks.filter((t) => {
      const byQ = !query || t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      const byCat = category === "all" || t.category === category;
      const byDiff = difficulty === "all" || t.difficulty === difficulty;
      return byQ && byCat && byDiff;
    });
  }, [q, category, difficulty]);

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} of {tasks.length} tasks</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks..."
            className="h-9 rounded-md border px-3 text-sm bg-background"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm bg-background"
          >
            <option value="all">All categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full‑stack</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm bg-background"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((t) => (
          <Link key={t.id} to={`/app/tasks/${t.id}`} className="rounded-xl border bg-background/60 backdrop-blur p-4 hover:bg-accent/40 transition-colors">
            <div className="font-medium text-base">{t.title}</div>
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
              <span className="rounded border px-2 py-0.5">{t.category}</span>
              <span className="rounded border px-2 py-0.5">{t.difficulty}</span>
              <span>{t.acceptance.length} criteria</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="p-6 text-sm text-muted-foreground">No tasks match your filters.</div>
      )}
    </div>
  );
}


