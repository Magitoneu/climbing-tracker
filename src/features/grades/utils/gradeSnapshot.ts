import { BoulderGradeSnapshot } from '../models/GradeSystem';
import { getDefaultDisplaySystem, toCanonicalValue, getGradeSystem } from '../services/gradeSystemService';

/**
 * Normalizes legacy grade system IDs to canonical builtin or custom system IDs.
 *
 * Handles backwards compatibility for old session data that may use 'V' or 'Font'
 * instead of 'vscale' or 'font'. Checks if the ID is a registered custom system.
 * Falls back to default display system if ID is invalid.
 *
 * @param legacyId - Legacy or current grade system identifier
 * @returns Normalized system ID (e.g., 'vscale', 'font', or custom ID)
 *
 * @internal
 */
function normalizeSystemId(legacyId?: string): string {
  if (!legacyId) return getDefaultDisplaySystem().id;
  const lower = legacyId.toLowerCase();
  if (lower === 'v' || lower === 'vscale') return 'vscale';
  if (lower === 'font' || lower === 'fontainebleau') return 'font';
  // If it's a registered custom or builtin id, use it
  const known = getGradeSystem(legacyId);
  if (known) return known.id;
  return getDefaultDisplaySystem().id;
}

/**
 * Creates a canonical grade snapshot for a given grade label and system.
 *
 * Builds a BoulderGradeSnapshot object containing the original grade information
 * plus its canonical value (0-18 scale). This snapshot enables cross-system
 * conversions and future-proofs data against grade system changes.
 *
 * Returns undefined if the grade label is not recognized in the given system.
 *
 * @param label - Grade label (e.g., 'V5', '6A+', 'Blue')
 * @param legacySystemId - Grade system identifier (may be legacy format like 'V' or 'Font')
 * @returns BoulderGradeSnapshot if grade is valid, undefined otherwise
 *
 * @example
 * const snapshot = buildGradeSnapshot('V5', 'V');
 * // Returns:
 * // {
 * //   originalSystemId: 'vscale',
 * //   originalSystemVersion: 1,
 * //   originalLabel: 'V5',
 * //   canonicalValue: 5
 * // }
 *
 * @example
 * const invalid = buildGradeSnapshot('InvalidGrade', 'V');
 * // Returns: undefined
 */
export function buildGradeSnapshot(label: string, legacySystemId?: string): BoulderGradeSnapshot | undefined {
  const systemId = normalizeSystemId(legacySystemId);
  const canonical = toCanonicalValue(systemId, label);
  if (canonical == null) return undefined;
  return {
    originalSystemId: systemId,
    originalSystemVersion: 1, // builtin version fixed for now
    originalLabel: label,
    canonicalValue: canonical,
  };
}

/**
 * Enriches a boulder or attempt entity with canonical grade data.
 *
 * Adds `gradeSnapshot` and `canonicalValue` fields if they're missing, enabling
 * cross-system grade conversions. Mutates the input object and returns it.
 *
 * Enrichment logic:
 * - If no snapshot exists, builds one from the grade label and system ID
 * - If snapshot exists but canonicalValue is missing, copies from snapshot
 * - If both exist, no modification is made
 *
 * This function is used during session save and load operations to ensure all
 * grade data is canonical-aware (Phase 2+ grading system architecture).
 *
 * @param b - Boulder or Attempt entity to enrich (mutated in place)
 * @param legacySystemId - Grade system identifier (defaults to default system if omitted)
 * @returns The same entity with enriched grade fields
 *
 * @example
 * const boulder = { grade: 'V5', flashed: true };
 * enrichBoulder(boulder, 'V');
 * // boulder is now:
 * // {
 * //   grade: 'V5',
 * //   flashed: true,
 * //   gradeSnapshot: {
 * //     originalSystemId: 'vscale',
 * //     originalSystemVersion: 1,
 * //     originalLabel: 'V5',
 * //     canonicalValue: 5
 * //   },
 * //   canonicalValue: 5
 * // }
 *
 * @example
 * const attempt = { grade: '6A', attempts: 3, flashed: false };
 * enrichBoulder(attempt, 'font');
 * // attempt now has gradeSnapshot and canonicalValue fields
 */
export function enrichBoulder<
  T extends { grade: string; gradeSnapshot?: BoulderGradeSnapshot; canonicalValue?: number },
>(b: T, legacySystemId?: string): T {
  if (!b.gradeSnapshot) {
    const snap = buildGradeSnapshot(b.grade, legacySystemId);
    if (snap) {
      b.gradeSnapshot = snap;
      b.canonicalValue = snap.canonicalValue;
    }
  } else if (b.gradeSnapshot && b.canonicalValue == null) {
    b.canonicalValue = b.gradeSnapshot.canonicalValue;
  }
  return b;
}
