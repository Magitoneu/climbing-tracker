
import { Boulder } from './Boulder';

export type GradeSystem = 'V' | 'Font' | string; // string for custom system ID

export interface Attempt {
  grade: string; // e.g., 'V3' or '6A'
  attempts: number;
  flashed: boolean;
}

export interface Session {
  id?: string; // Firestore document id (local sessions may not have one yet)
  userId?: string; // owner uid
  date: string; // ISO date
  durationMinutes?: number;
  notes?: string;
  gradeSystem: GradeSystem; // can be built-in or custom system ID
  attempts: Attempt[]; // list of attempts / aggregated entries
  boulders?: Boulder[]; // raw boulder entries (legacy field used by UI)
  createdAt?: string; // ISO when loaded client-side (Firestore Timestamp serialized)
  updatedAt?: string;
  migrated?: boolean; // set true if uploaded from local storage
}
