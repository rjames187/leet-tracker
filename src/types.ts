export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeProblem {
  id: number;
  name: string;
  slug: string;
  rating: number;
  difficulty?: Difficulty;
  completed: boolean;
}