export type GradeSystem = 'V' | 'Font';

export interface Attempt {
  grade: string; // e.g., 'V3' or '6A'
  attempts: number;
  flashed: boolean;
}

export interface Session {
  id?: number;
  date: string; // ISO date
  durationMinutes?: number;
  notes?: string;
  gradeSystem: GradeSystem;
  attempts: Attempt[];
}
