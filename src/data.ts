import type { LeetCodeProblem } from "./types";

export async function getData(): Promise<LeetCodeProblem[]> {
  const res = await fetch('/ratings.txt');
  if (!res.ok) {
    throw new Error('Failed to fetch problem data');
  }

  const file = await res.text();

  const problems: LeetCodeProblem[] = [];

  for (const line of file.split('\n')) {
    const items = line.trim().split('\t');
    
    const rating = Number(items[0]);
    const id = Number(items[1]);
    const name = items[2];
    const slug = items[4];

    problems.push({
      id,
      name,
      slug,
      rating,
      completed: false
    })
  }

  problems.shift(); // Remove the header line
  problems.pop(); // Remove the last empty line if it exists

  console.log('Loaded problems:', problems.length);
  console.log(problems);

  return problems;
}