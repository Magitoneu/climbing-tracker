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

export function getGradeSystem(id: string): GradeSystemDefinition | undefined {
  ensureCache();
  return cache![id];
}

export function getAllGradeSystems(): GradeSystemDefinition[] {
  ensureCache();
  return Object.values(cache!);
}

export function getDefaultDisplaySystem(): GradeSystemDefinition {
  ensureCache();
  // current heuristic: V-scale default if present
  return cache!['vscale'] || Object.values(cache!)[0];
}

export function toCanonicalValue(systemId: string, label: string): number | undefined {
  ensureCache();
  const system = cache![systemId];
  if (!system) return undefined;
  const match = system.grades.find(g => g.label === label || g.id === label || g.aliases?.includes(label));
  return match?.canonicalValue;
}

export function fromCanonicalValue(systemId: string, canonical: number): string | undefined {
  ensureCache();
  const system = cache![systemId];
  if (!system) return undefined;
  return system.grades.find(g => g.canonicalValue === canonical)?.label;
}

export function convertLabel(label: string, fromSystemId: string, toSystemId: string): string {
  if (fromSystemId === toSystemId) return label;
  const c = toCanonicalValue(fromSystemId, label);
  if (c == null) return label;
  const target = fromCanonicalValue(toSystemId, c);
  return target || label;
}

// Placeholder for future: register custom systems
export function registerCustomSystem(system: GradeSystemDefinition) {
  ensureCache();
  cache![system.id] = system;
}

export function unregisterSystem(id: string) {
  ensureCache();
  if (cache && cache[id]) {
    delete cache[id];
  }
}
