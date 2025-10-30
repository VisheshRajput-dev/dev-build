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
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return (
      <div className="p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Task not found</h2>
        <p className="text-muted-foreground">The task you're looking for does not exist.</p>
      </div>
    );
  }
  const defaultFiles = useMemo<FileMap>(() => ({ ...(task.starterFiles || {}) }), [task]);
  const [files, setFiles] = useState<FileMap>(defaultFiles);
  const { user } = useAuth();

  useEffect(() => {
    const saved = loadLocalTask(task.id);
    if (saved) setFiles({ ...defaultFiles, ...saved });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

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
          const review = await reviewCodeWithGemini({ key: ai.key, task, files });
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
        <div className="pt-2 flex gap-2">
          <button onClick={handleRunChecks} className="h-9 rounded-md border px-3 text-sm bg-primary text-primary-foreground">
            Run checks
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="h-9 rounded-md border px-3 text-sm bg-secondary">
            {submitting ? "Submitting..." : "Submit for XP"}
          </button>
        </div>
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
        {submitMsg && <div className="text-sm text-muted-foreground">{submitMsg}</div>}
      </div>
      <div>
        <EditorPane files={files} onChange={setFiles} height={560} />
      </div>
    </div>
  );
}


