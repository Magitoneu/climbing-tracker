
import { Boulder } from './Boulder';

export type GradeSystem = 'V' | 'Font' | string; // string for custom system ID

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
  gradeSystem: GradeSystem; // can be built-in or custom system ID
  attempts: Attempt[];
  boulders?: Boulder[];
}
