import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import tasks from "@/data/tasks.json";
import EditorPane, { type FileMap } from "@/components/editor/EditorPane";
import { loadLocalTask, saveLocalTask } from "@/lib/storage";
import { runChecks, type CheckResult } from "@/lib/checks";
import { computeScore, xpFromScore } from "@/lib/scoring";
import { incrementUserXp, saveSubmission } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import { getAiSettings, reviewCodeWithGemini } from "@/lib/ai";

export default function TaskDetail() {
  const { taskId } = useParams();
  const foundTask = tasks.find((t) => t.id === taskId);
  if (!foundTask) {
    return (
      <div className="p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Task not found</h2>
        <p className="text-muted-foreground">The task you're looking for does not exist.</p>
      </div>
    );
  }
  // After early return guard, task is guaranteed to exist
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const task = foundTask!;
  const initialFiles = useMemo<FileMap>(() => {
    const base: FileMap = {};
    if (task.starterFiles) {
      Object.entries(task.starterFiles).forEach(([k, v]) => {
        if (typeof v === "string") base[k] = v;
      });
    }
    const saved = loadLocalTask(task.id);
    return saved ? { ...base, ...saved } : base;
  }, [task]);
  const [files, setFiles] = useState<FileMap>(initialFiles);
  const { user } = useAuth();

  // When switching tasks, refresh state from local storage
  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    saveLocalTask(task.id, files);
  }, [task.id, files]);

  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  function handleRunChecks() {
    const r = runChecks(task, files);
    setResults(r);
  }

  async function handleSubmit() {
    if (!user) {
      setSubmitMsg("Please sign in to submit.");
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const checks = runChecks(task, files);
      setResults(checks);
      let score = computeScore(checks);
      const ai = getAiSettings();
      if (ai.enabled && ai.key) {
        try {
          const review = await reviewCodeWithGemini({
            key: ai.key,
            task: { title: task.title, description: task.description, acceptance: task.acceptance },
            files,
          });
          // Blend scores 60% static, 40% AI
          score = Math.round(0.6 * score + 0.4 * (review.score ?? 0));
        } catch {
          // ignore AI errors; keep static score
        }
      }
      const xp = xpFromScore(score, task.difficulty as string);
      await saveSubmission({ userId: user.uid, taskId: task.id, files, checks, score });
      await incrementUserXp(user.uid, xp);
      setSubmitMsg(`Submitted. Score ${score}. +${xp} XP`);
    } catch (e) {
      setSubmitMsg("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetToStarter() {
    if (confirm("Reset files to starter? This will overwrite current edits for this task.")) {
      const base: FileMap = {};
      if (task.starterFiles) {
        Object.entries(task.starterFiles).forEach(([k, v]) => {
          if (typeof v === "string") base[k] = v;
        });
      }
      setFiles(base);
      saveLocalTask(task.id, base);
      setResults(null);
      setSubmitMsg(null);
    }
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify(files, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.id}-files.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="p-6 grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{task.title}</h2>
          <div className="text-sm text-muted-foreground">{task.category} • {task.difficulty}</div>
        </div>
        <p>{task.description}</p>
        <div>
          <h3 className="text-lg font-medium">Acceptance Criteria</h3>
          <ul className="list-disc pl-6 text-sm">
            {task.acceptance.map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
        {task.hints?.length ? (
          <div>
            <h3 className="text-lg font-medium">Hints</h3>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
              {task.hints.map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="pt-2 flex gap-2 flex-wrap">
          <button onClick={handleRunChecks} className="h-9 rounded-md border px-3 text-sm bg-primary text-primary-foreground">
            Run checks
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="h-9 rounded-md border px-3 text-sm bg-secondary">
            {submitting ? "Submitting..." : "Submit for XP"}
          </button>
          <button onClick={handleResetToStarter} className="h-9 rounded-md border px-3 text-sm">
            Reset to starter
          </button>
          <button onClick={handleDownload} className="h-9 rounded-md border px-3 text-sm">
            Download files
          </button>
        </div>
        {submitMsg && (
          <div className="rounded-md border border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400 px-4 py-2 text-sm">
            {submitMsg}
          </div>
        )}
        {results && (
          <div className="rounded-md border divide-y">
            {results.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-3 text-sm">
                <span>{r.name}</span>
                <span className={r.passed ? "text-green-600" : "text-red-600"}>{r.passed ? "Passed" : "Failed"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <EditorPane files={files} onChange={setFiles} height={560} />
      </div>
    </div>
  );
}


