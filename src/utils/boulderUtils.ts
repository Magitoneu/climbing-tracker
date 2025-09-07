// Utility functions for boulder aggregation and grade sorting
import { Attempt } from '../models/Session';
import { V_GRADES, FONT_GRADES } from '../models/grades';

export type Boulder = { grade: string; flashed: boolean };

/**
 * Aggregates boulders by grade and flash status.
 * @param boulders Array of boulders or attempts
 * @returns Aggregated data by grade
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
 * Sorts grades according to the selected grade system.
 * @param grades Array of grade strings
 * @param system 'V' or 'Font'
 * @returns Sorted array of grades
 */
export function sortGrades(grades: string[], system: 'V' | 'Font') {
  const order = system === 'V' ? V_GRADES : FONT_GRADES;
  return [...grades].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Finds the maximum grade from a list of boulders.
 * @param boulders Array of boulders
 * @param system 'V' or 'Font'
 * @returns The highest grade string
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
