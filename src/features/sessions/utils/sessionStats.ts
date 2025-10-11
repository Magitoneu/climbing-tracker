import { Attempt } from '../models/Session';
import { convertGrade } from '../../grades/models/gradeConversion';

export interface SessionStats {
  volume: number; // total attempts (summed attempts field)
  problems: number; // number of distinct logged attempts entries
  flashes: number; // count where flashed = true
  flashRate: number; // flashes / problems (0-1)
  maxGrade?: string; // highest grade label encountered
}

// Compute stats independent of grade system choice; maxGrade is lexical placeholder unless conversion provided.
export function buildSessionStats(boulders: Attempt[], gradeSystem: string): SessionStats {
  if (!Array.isArray(boulders) || boulders.length === 0) {
    return { volume: 0, problems: 0, flashes: 0, flashRate: 0 };
  }
  let volume = 0;
  let flashes = 0;
  let maxGrade: string | undefined;
  for (const b of boulders) {
    const attempts = b.attempts ?? 1;
    volume += attempts;
    if (b.flashed || attempts === 1) flashes += 1; // treat single attempt as implicit flash per existing logic
    if (!maxGrade) maxGrade = b.grade;
    else {
      // naive ordering: attempt convertGrade if system is V/Font context else lexical fallback
      try {
        const current =
          gradeSystem === 'V' || gradeSystem === 'Font' ? convertGrade(maxGrade, gradeSystem as any) : maxGrade;
        const next =
          gradeSystem === 'V' || gradeSystem === 'Font' ? convertGrade(b.grade, gradeSystem as any) : b.grade;
        if (next && current && next > current) maxGrade = b.grade;
      } catch {
        if (b.grade > maxGrade) maxGrade = b.grade;
      }
    }
  }
  const problems = boulders.length;
  const flashRate = problems === 0 ? 0 : flashes / problems;
  return { volume, problems, flashes, flashRate, maxGrade };
}
