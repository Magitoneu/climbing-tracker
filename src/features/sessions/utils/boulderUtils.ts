// Utility functions for boulder aggregation and grade sorting
import { Attempt } from '../models/Session';
import { V_GRADES, FONT_GRADES } from '../../grades/models/grades';

/**
 * Minimal boulder representation with grade and flash status.
 */
export type Boulder = { grade: string; flashed: boolean };

/**
 * Aggregates boulders by grade, counting total problems and flashes per grade.
 *
 * Groups boulders/attempts by their grade label and tallies how many were attempted
 * and how many were flashed at each grade. Useful for generating grade distribution
 * charts or summaries.
 *
 * @param boulders - Array of Boulder or Attempt objects
 * @returns Record mapping grade labels to flash/total counts
 *
 * @example
 * const boulders = [
 *   { grade: 'V4', flashed: true },
 *   { grade: 'V4', flashed: false },
 *   { grade: 'V5', flashed: true },
 * ];
 * const agg = aggregateBoulders(boulders);
 * // Returns:
 * // {
 * //   'V4': { flashed: 1, total: 2 },
 * //   'V5': { flashed: 1, total: 1 }
 * // }
 */
export function aggregateBoulders(boulders: Boulder[] | Attempt[]) {
  const result: Record<string, { flashed: number; total: number }> = {};
  boulders.forEach((b: any) => {
    const grade = b.grade;
    if (!result[grade]) {
      result[grade] = { flashed: 0, total: 0 };
    }
    result[grade].total += 1;
    if (b.flashed) result[grade].flashed += 1;
  });
  return result;
}

/**
 * Sorts grade labels according to the builtin V or Font grade scale.
 *
 * Uses the canonical ordering defined in V_GRADES or FONT_GRADES constants.
 * Grades not found in the scale are sorted to the end based on their original order.
 * Returns a new array; does not mutate the input.
 *
 * @param grades - Array of grade label strings
 * @param system - Grade system to use for ordering ('V' or 'Font')
 * @returns New array of grades sorted by difficulty (easiest to hardest)
 *
 * @example
 * const grades = ['V5', 'V2', 'V7', 'V3'];
 * const sorted = sortGrades(grades, 'V');
 * // Returns: ['V2', 'V3', 'V5', 'V7']
 *
 * @example
 * const fontGrades = ['6C', '5', '6A', '6B+'];
 * const sorted = sortGrades(fontGrades, 'Font');
 * // Returns: ['5', '6A', '6B+', '6C']
 */
export function sortGrades(grades: string[], system: 'V' | 'Font') {
  const order = system === 'V' ? V_GRADES : FONT_GRADES;
  return [...grades].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Finds the highest grade from a list of boulders based on the given grade system.
 *
 * Uses the canonical ordering from V_GRADES or FONT_GRADES to determine which
 * grade is "hardest". Returns null if the input array is empty.
 *
 * @param boulders - Array of Boulder objects
 * @param system - Grade system to use for comparison ('V' or 'Font')
 * @returns The highest grade label, or null if no boulders
 *
 * @example
 * const boulders = [
 *   { grade: 'V4', flashed: true },
 *   { grade: 'V7', flashed: false },
 *   { grade: 'V5', flashed: true },
 * ];
 * const max = getMaxGrade(boulders, 'V');
 * // Returns: 'V7'
 *
 * @example
 * const max = getMaxGrade([], 'V');
 * // Returns: null
 */
export function getMaxGrade(boulders: Boulder[], system: 'V' | 'Font') {
  const order = system === 'V' ? V_GRADES : FONT_GRADES;
  return boulders.reduce<string | null>((max, b) => {
    if (max === null) return b.grade;
    const idxB = order.indexOf(b.grade);
    const idxMax = order.indexOf(max);
    return idxB > idxMax ? b.grade : max;
  }, null);
}
