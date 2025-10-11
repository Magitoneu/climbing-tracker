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
export interface FormattableGradeLike {
  grade: string;
  gradeSnapshot?: { canonicalValue: number; originalSystemId: string; originalLabel: string };
  canonicalValue?: number;
}

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

export function formatAttempt(attempt: Attempt & FormattableGradeLike, targetSystemId: string) {
  return formatGrade(attempt, targetSystemId);
}

export function formatBoulder(boulder: Boulder, targetSystemId: string) {
  return formatGrade(boulder as any, targetSystemId);
}
