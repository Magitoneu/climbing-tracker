import { useCallback, useEffect, useState } from 'react';
import storage from '../../../storage/simpleStore';
import {
  getAllGradeSystems,
  getDefaultDisplaySystem,
  fromCanonicalValue,
  toCanonicalValue,
  getGradeSystem,
} from '../services/gradeSystemService';
import { Boulder } from '../../sessions/models/Boulder';
import { Attempt } from '../../sessions/models/Session';

const STORAGE_KEY = 'displayGradeSystemId';

/**
 * React hook that manages the user's preferred grade display system.
 *
 * Loads the user's saved display system preference from AsyncStorage on mount,
 * provides the current active system, and allows changing the preference.
 * The display system determines how grades are shown throughout the app
 * (separate from the logging system used when creating sessions).
 *
 * @returns Hook state containing:
 * - `systemId`: Current display system ID (e.g., 'vscale', 'font', or custom ID)
 * - `setDisplaySystem`: Async function to update the display system preference
 * - `allSystems`: Array of all available grade systems (builtin + custom)
 * - `activeSystem`: The active GradeSystem object (falls back to default if not found)
 * - `loading`: Boolean indicating if initial load from storage is complete
 *
 * @example
 * function SettingsScreen() {
 *   const { systemId, setDisplaySystem, allSystems, loading } = useGradeDisplaySystem();
 *
 *   if (loading) return <Text>Loading...</Text>;
 *
 *   return (
 *     <Picker selectedValue={systemId} onValueChange={setDisplaySystem}>
 *       {allSystems.map(sys => (
 *         <Picker.Item key={sys.id} label={sys.name} value={sys.id} />
 *       ))}
 *     </Picker>
 *   );
 * }
 */
export function useGradeDisplaySystem() {
  const [systemId, setSystemId] = useState<string>(getDefaultDisplaySystem().id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(STORAGE_KEY);
      if (saved) setSystemId(saved);
      setLoading(false);
    })();
  }, []);

  const allSystems = getAllGradeSystems();
  const activeSystem = getGradeSystem(systemId) || getDefaultDisplaySystem();

  const setDisplaySystem = useCallback(async (id: string) => {
    await storage.setItem(STORAGE_KEY, id);
    setSystemId(id);
  }, []);

  return { systemId, setDisplaySystem, allSystems, activeSystem, loading };
}

// Format helpers

/**
 * Interface for any entity (Boulder or Attempt) that can be formatted for display.
 * Represents the minimal grade-related fields needed for conversion.
 */
export interface FormattableGradeLike {
  grade: string;
  gradeSnapshot?: { canonicalValue: number; originalSystemId: string; originalLabel: string };
  canonicalValue?: number;
}

/**
 * Converts a grade entity to a label in the target grade system.
 *
 * Uses a multi-stage fallback strategy:
 * 1. If canonical value exists, perform exact lookup (approximate: false)
 * 2. If gradeSnapshot exists, convert via original system (approximate: true)
 * 3. Fall back to raw grade label (approximate: true)
 *
 * The `approximate` flag indicates whether the conversion is inexact (e.g., when
 * the target system doesn't have an equivalent grade or snapshot data is missing).
 *
 * @param entity - Boulder, Attempt, or any entity with grade fields
 * @param targetSystemId - Desired output system ID (e.g., 'vscale', 'font', custom ID)
 * @returns Object with:
 * - `label`: Grade label in target system (e.g., 'V5', '6A+')
 * - `approximate`: True if conversion is inexact or uses fallback
 *
 * @example
 * const boulder = { grade: 'V5', canonicalValue: 5 };
 * const { label, approximate } = formatGrade(boulder, 'font');
 * // Returns: { label: '6A+', approximate: false }
 *
 * @example
 * const legacyBoulder = { grade: 'V3' }; // no snapshot
 * const { label, approximate } = formatGrade(legacyBoulder, 'font');
 * // Returns: { label: 'V3', approximate: true } (fallback to raw grade)
 */
export function formatGrade(
  entity: FormattableGradeLike,
  targetSystemId: string
): { label: string; approximate: boolean } {
  // Prefer canonical if available
  const canonical = entity.canonicalValue ?? entity.gradeSnapshot?.canonicalValue;
  if (canonical != null) {
    // simple exact lookup in target system
    const label = fromCanonicalValue(targetSystemId, canonical);
    if (label) return { label, approximate: false };
  }
  // Attempt fallback conversion using original system if present
  if (entity.gradeSnapshot) {
    const { originalLabel, originalSystemId } = entity.gradeSnapshot;
    const c = toCanonicalValue(originalSystemId, originalLabel);
    if (c != null) {
      const label = fromCanonicalValue(targetSystemId, c);
      if (label) return { label, approximate: true };
    }
  }
  // Final fallback: use raw grade
  return { label: entity.grade, approximate: true };
}

/**
 * Formats an Attempt entity's grade for display in the target system.
 *
 * Convenience wrapper around `formatGrade` for Attempt objects.
 * See `formatGrade` for conversion logic details.
 *
 * @param attempt - Attempt entity with grade fields
 * @param targetSystemId - Desired output system ID
 * @returns Object with `label` and `approximate` flag
 *
 * @example
 * const attempt = { grade: 'V4', flashed: true, attempts: 1, canonicalValue: 4 };
 * const { label, approximate } = formatAttempt(attempt, 'font');
 * // Returns: { label: '6A', approximate: false }
 */
export function formatAttempt(attempt: Attempt & FormattableGradeLike, targetSystemId: string) {
  return formatGrade(attempt, targetSystemId);
}

/**
 * Formats a Boulder entity's grade for display in the target system.
 *
 * Convenience wrapper around `formatGrade` for Boulder objects.
 * See `formatGrade` for conversion logic details.
 *
 * @param boulder - Boulder entity with grade fields
 * @param targetSystemId - Desired output system ID
 * @returns Object with `label` and `approximate` flag
 *
 * @example
 * const boulder = { grade: 'V7', flashed: false, canonicalValue: 7 };
 * const { label, approximate } = formatBoulder(boulder, 'font');
 * // Returns: { label: '6C', approximate: false }
 */
export function formatBoulder(boulder: Boulder, targetSystemId: string) {
  return formatGrade(boulder as any, targetSystemId);
}
