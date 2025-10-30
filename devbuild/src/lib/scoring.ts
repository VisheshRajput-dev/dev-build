import type { CheckResult } from "@/lib/checks";

export function computeScore(checks: CheckResult[]): number {
  if (!checks.length) return 0;
  const passed = checks.filter((c) => c.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function xpFromScore(score: number, difficulty: string): number {
  const base = score >= 90 ? 120 : score >= 70 ? 80 : score >= 50 ? 40 : 10;
  const mult = difficulty === "hard" ? 1.5 : difficulty === "medium" ? 1.2 : 1;
  return Math.round(base * mult);
}


