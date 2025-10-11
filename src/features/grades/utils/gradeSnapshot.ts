import { BoulderGradeSnapshot } from '../models/GradeSystem';
import { getDefaultDisplaySystem, toCanonicalValue, getGradeSystem } from '../services/gradeSystemService';

// Map legacy session gradeSystem field to builtin system ids
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
