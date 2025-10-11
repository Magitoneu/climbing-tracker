import { Attempt } from '../models/Session';
import { convertGrade } from '../../grades/models/gradeConversion';

/**
 * Statistics computed from a climbing session's attempts.
 */
export interface SessionStats {
  volume: number; // total attempts (summed attempts field)
  problems: number; // number of distinct logged attempts entries
  flashes: number; // count where flashed = true
  flashRate: number; // flashes / problems (0-1)
  maxGrade?: string; // highest grade label encountered
}

/**
 * Computes aggregated statistics from a session's attempt data.
 *
 * Calculates:
 * - **Volume**: Sum of all attempt counts (total number of tries across all problems)
 * - **Problems**: Number of distinct problems logged
 * - **Flashes**: Count of problems marked as flashed OR with only 1 attempt (implicit flash)
 * - **Flash Rate**: Proportion of problems flashed (0.0 to 1.0)
 * - **Max Grade**: Highest grade encountered, using grade conversion for V/Font systems,
 *   lexical comparison otherwise
 *
 * Returns zero stats if input is empty or invalid. For grade system-aware max grade
 * calculation, pass 'V' or 'Font' as the grade system; custom systems fall back to
 * lexical comparison.
 *
 * @param boulders - Array of Attempt objects from the session
 * @param gradeSystem - Grade system ID (e.g., 'V', 'Font', or custom ID) for max grade logic
 * @returns SessionStats object with computed metrics
 *
 * @example
 * const attempts: Attempt[] = [
 *   { grade: 'V4', flashed: true, attempts: 1 },
 *   { grade: 'V5', flashed: false, attempts: 3 },
 *   { grade: 'V3', flashed: false, attempts: 1 }, // implicit flash
 * ];
 * const stats = buildSessionStats(attempts, 'V');
 * // Returns:
 * // {
 * //   volume: 5,        // 1 + 3 + 1
 * //   problems: 3,
 * //   flashes: 2,       // V4 explicit flash + V3 implicit flash
 * //   flashRate: 0.67,  // 2/3
 * //   maxGrade: 'V5'
 * // }
 */
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
