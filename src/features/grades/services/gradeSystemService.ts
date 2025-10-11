// Phase 1: simple in-memory grade system service.
// Future phases will add Firestore-backed custom systems and versioning.

import { GradeSystemDefinition } from '../models/GradeSystem';
import { BUILTIN_V_SYSTEM, BUILTIN_FONT_SYSTEM, listBuiltinSystems } from '../models/gradeConversion';

let cache: Record<string, GradeSystemDefinition> | null = null;

function ensureCache() {
  if (!cache) {
    cache = Object.fromEntries(listBuiltinSystems().map(s => [s.id, s]));
  }
}

/**
 * Retrieves a grade system definition by its unique ID.
 *
 * Looks up both builtin systems (V-scale, Font) and dynamically registered custom systems.
 * The cache is lazily initialized on first access.
 *
 * @param id - Unique identifier for the grade system (e.g., 'vscale', 'font', 'user-mygym')
 * @returns Grade system definition if found, undefined otherwise
 *
 * @example
 * ```ts
 * const vScale = getGradeSystem('vscale');
 * console.log(vScale?.name); // "V-Scale"
 *
 * const customSystem = getGradeSystem('user-gym-colors');
 * if (customSystem) {
 *   console.log(customSystem.grades);
 * }
 * ```
 */
export function getGradeSystem(id: string): GradeSystemDefinition | undefined {
  ensureCache();
  return cache![id];
}

/**
 * Returns all available grade systems (builtin + custom).
 *
 * Includes V-Scale, Font, and any user-defined systems that have been registered via
 * `registerCustomSystem()` or loaded from Firestore.
 *
 * @returns Array of all grade system definitions in the registry
 *
 * @example
 * ```ts
 * const allSystems = getAllGradeSystems();
 * allSystems.forEach(sys => {
 *   console.log(`${sys.name} (${sys.scope}): ${sys.grades.length} grades`);
 * });
 * // V-Scale (global): 19 grades
 * // Font (global): 19 grades
 * // My Gym (user): 10 grades
 * ```
 */
export function getAllGradeSystems(): GradeSystemDefinition[] {
  ensureCache();
  return Object.values(cache!);
}

/**
 * Returns the default grade system for displaying sessions.
 *
 * Uses V-Scale as the fallback if available, otherwise returns the first registered system.
 * This is used when the user has not set a preferred display system.
 *
 * @returns Grade system definition (V-Scale preferred, or first available)
 *
 * @example
 * ```ts
 * const defaultSystem = getDefaultDisplaySystem();
 * console.log(`Using ${defaultSystem.name} for display`);
 * // "Using V-Scale for display"
 * ```
 */
export function getDefaultDisplaySystem(): GradeSystemDefinition {
  ensureCache();
  // current heuristic: V-scale default if present
  return cache!['vscale'] || Object.values(cache!)[0];
}

/**
 * Converts a grade label to its canonical difficulty value (0-18 scale).
 *
 * Canonical values enable cross-system comparisons and conversions. For example:
 * - V0 → 0, V5 → 5, V10 → 10
 * - 4 (Font) → 0, 6A+ → 5, 7C → 10
 *
 * Matches against label, ID, or aliases (e.g., "V-easy" → "VB").
 *
 * @param systemId - ID of the grade system (e.g., 'vscale', 'font')
 * @param label - Grade label to convert (e.g., 'V5', '6A+')
 * @returns Canonical difficulty value if found, undefined if system or grade not recognized
 *
 * @example
 * ```ts
 * const canonical = toCanonicalValue('vscale', 'V5');
 * console.log(canonical); // 5
 *
 * const fontCanonical = toCanonicalValue('font', '6A+');
 * console.log(fontCanonical); // 5 (equivalent to V5)
 *
 * const invalid = toCanonicalValue('vscale', 'invalid-grade');
 * console.log(invalid); // undefined
 * ```
 */
export function toCanonicalValue(systemId: string, label: string): number | undefined {
  ensureCache();
  const system = cache![systemId];
  if (!system) return undefined;
  const match = system.grades.find(g => g.label === label || g.id === label || g.aliases?.includes(label));
  return match?.canonicalValue;
}

/**
 * Converts a canonical difficulty value to a grade label in the target system.
 *
 * Inverse of `toCanonicalValue()`. Returns the display label for the given difficulty level.
 *
 * @param systemId - ID of the target grade system (e.g., 'vscale', 'font')
 * @param canonical - Canonical difficulty value (0-18)
 * @returns Grade label in target system if found, undefined if system doesn't have that grade
 *
 * @example
 * ```ts
 * const vLabel = fromCanonicalValue('vscale', 5);
 * console.log(vLabel); // "V5"
 *
 * const fontLabel = fromCanonicalValue('font', 5);
 * console.log(fontLabel); // "6A+"
 *
 * const outOfRange = fromCanonicalValue('vscale', 99);
 * console.log(outOfRange); // undefined
 * ```
 */
export function fromCanonicalValue(systemId: string, canonical: number): string | undefined {
  ensureCache();
  const system = cache![systemId];
  if (!system) return undefined;
  return system.grades.find(g => g.canonicalValue === canonical)?.label;
}

/**
 * Converts a grade label from one system to another via canonical mapping.
 *
 * Uses the canonical value (0-18) as an intermediate representation to translate between
 * different grading systems (e.g., V-Scale ↔ Font). If conversion fails at any step,
 * returns the original label unchanged.
 *
 * @param label - Grade label to convert (e.g., 'V5')
 * @param fromSystemId - Source grade system ID (e.g., 'vscale')
 * @param toSystemId - Target grade system ID (e.g., 'font')
 * @returns Converted grade label in target system, or original label if conversion impossible
 *
 * @example
 * ```ts
 * const fontGrade = convertLabel('V5', 'vscale', 'font');
 * console.log(fontGrade); // "6A+"
 *
 * const sameSystem = convertLabel('V5', 'vscale', 'vscale');
 * console.log(sameSystem); // "V5" (no-op)
 *
 * const invalidGrade = convertLabel('invalid', 'vscale', 'font');
 * console.log(invalidGrade); // "invalid" (fallback to original)
 * ```
 */
export function convertLabel(label: string, fromSystemId: string, toSystemId: string): string {
  if (fromSystemId === toSystemId) return label;
  const c = toCanonicalValue(fromSystemId, label);
  if (c == null) return label;
  const target = fromCanonicalValue(toSystemId, c);
  return target || label;
}

/**
 * Registers a custom grade system into the runtime registry.
 *
 * Once registered, the system becomes available in all pickers and conversion functions.
 * Used internally by `customGradeSystemService` to sync user-defined systems from Firestore.
 *
 * @param system - Complete grade system definition with id, name, grades, and canonical mappings
 *
 * @example
 * ```ts
 * registerCustomSystem({
 *   id: 'user-mygym',
 *   name: 'My Gym Colors',
 *   discipline: 'boulder',
 *   version: 1,
 *   scope: 'user',
 *   active: true,
 *   grades: [
 *     { id: 'green', label: 'Green', canonicalValue: 0, displayOrder: 0, color: '#00ff00' },
 *     { id: 'blue', label: 'Blue', canonicalValue: 3, displayOrder: 1, color: '#0000ff' },
 *     // ... more grades
 *   ]
 * });
 *
 * // Now available system-wide
 * const customSystem = getGradeSystem('user-mygym');
 * ```
 */
export function registerCustomSystem(system: GradeSystemDefinition) {
  ensureCache();
  cache![system.id] = system;
}

/**
 * Removes a grade system from the runtime registry.
 *
 * Used when deleting custom systems to ensure they no longer appear in pickers or conversions.
 * Builtin systems (V-Scale, Font) should not be unregistered.
 *
 * @param id - ID of the grade system to remove (e.g., 'user-mygym')
 *
 * @example
 * ```ts
 * unregisterSystem('user-oldgym');
 * // System no longer available in getGradeSystem() or getAllGradeSystems()
 * ```
 */
export function unregisterSystem(id: string) {
  ensureCache();
  if (cache && cache[id]) {
    delete cache[id];
  }
}
