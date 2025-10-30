type ReviewOutput = {
  summary: string;
  positives: string[];
  issues: { line?: number; reason: string; fix?: string }[];
  score: number; // 0-100
};

const AI_ENABLED_KEY = "realdesk.ai.enabled";
const AI_KEY_KEY = "realdesk.ai.key";
let lastCallAt = 0;

export function getAiSettings() {
  const enabled = localStorage.getItem(AI_ENABLED_KEY) === "true";
  const key = localStorage.getItem(AI_KEY_KEY) ?? "";
  return { enabled, key };
}

export function setAiEnabled(enabled: boolean) {
  localStorage.setItem(AI_ENABLED_KEY, enabled ? "true" : "false");
}

export function setAiKey(key: string) {
  localStorage.setItem(AI_KEY_KEY, key);
}

export async function validateGeminiKey(key: string): Promise<boolean> {
  if (!key) return false;
  try {
    const ok = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        key
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] }),
      }
    );
    return ok.status === 200;
  } catch {
    return false;
  }
}

export async function reviewCodeWithGemini(params: {
  key: string;
  task: { title: string; description: string; acceptance: string[] };
  files: Record<string, string>;
}): Promise<ReviewOutput> {
  // Simple rate limit: 10s between calls
  const now = Date.now();
  if (now - lastCallAt < 10_000) {
    throw new Error("AI review is rate-limited. Please wait a moment.");
  }
  lastCallAt = now;

  const prompt = buildPrompt(params.task, params.files);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      params.key
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error("Gemini request failed");
  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const parsed = safeParseReviewJson(text);
  return parsed;
}

function buildPrompt(task: { title: string; description: string; acceptance: string[] }, files: Record<string, string>) {
  const filesJoined = Object.entries(files)
    .map(([p, c]) => `--FILE: ${p}\n${c}`)
    .join("\n\n");
  const acceptance = task.acceptance.map((a, i) => `${i + 1}. ${a}`).join("\n");
  return `You are a code reviewer. Evaluate the student's submission for the task titled "${task.title}".
Acceptance criteria:\n${acceptance}\n\nReturn STRICT JSON with fields: {"summary": string, "positives": string[], "issues": [{"reason": string, "fix": string}], "score": number(0-100)}. DO NOT include backticks or commentary outside JSON.\n\nHere are the files:\n${filesJoined}`;
}

function safeParseReviewJson(text: string): ReviewOutput {
  // try to find a JSON block; fall back to minimal object
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const json = text.slice(start, end + 1);
      const obj = JSON.parse(json);
      return {
        summary: String(obj.summary ?? ""),
        positives: Array.isArray(obj.positives) ? obj.positives.map(String) : [],
        issues: Array.isArray(obj.issues) ? obj.issues.map((i: any) => ({ reason: String(i.reason ?? ""), fix: i.fix ? String(i.fix) : undefined })) : [],
        score: Number.isFinite(obj.score) ? Math.max(0, Math.min(100, Number(obj.score))) : 0,
      };
    }
  } catch {}
  return { summary: "", positives: [], issues: [], score: 0 };
}


