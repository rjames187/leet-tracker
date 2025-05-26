import type { LeetCodeProblem } from "./types";

export async function getData(): Promise<LeetCodeProblem[]> {
  const res = await fetch('/data.json');
  if (!res.ok) {
    throw new Error('Failed to fetch problem data');
  }

  const problems: LeetCodeProblem[] = await res.json();

  for (const prob of problems) {
    const checked = localStorage.getItem(`${prob.id}`);
    if (checked === 't') {
      prob.completed = true;
    }
  }

  return problems;
}