// Legacy simple conversion plus new canonical-based scaffold.
export type GradeSystem = 'V' | 'Font';
import { V_GRADES, FONT_GRADES } from './grades';
import { GradeSystemDefinition, GradeEntry, GradeConversionResult } from './GradeSystem';

// Conversion maps based on provided table
export const vToFont: Record<string, string> = {
  VB: '3–4',
  V0: '4–4+',
  V1: '5–5+',
  V2: '5+–6A',
  V3: '6A–6A+',
  V4: '6B–6B+',
  V5: '6C–6C+',
  V6: '7A',
  V7: '7A+',
  V8: '7B',
  V9: '7B+',
  V10: '7C',
  V11: '7C+',
  V12: '8A',
  V13: '8A+',
  V14: '8B',
  V15: '8B+',
  V16: '8C',
  V17: '9A',
};

export const fontToV: Record<string, string> = {
  '3': 'VB',
  '4': 'VB',
  '4+': 'V0',
  '5': 'V1',
  '5+': 'V2',
  '6A': 'V2',
  '6A+': 'V3',
  '6B': 'V4',
  '6B+': 'V4',
  '6C': 'V5',
  '6C+': 'V5',
  '7A': 'V6',
  '7A+': 'V7',
  '7B': 'V8',
  '7B+': 'V9',
  '7C': 'V10',
  '7C+': 'V11',
  '8A': 'V12',
  '8A+': 'V13',
  '8B': 'V14',
  '8B+': 'V15',
  '8C': 'V16',
  '9A': 'V17',
};

export function convertGrade(grade: string, toSystem: GradeSystem): string {
  if (toSystem === 'Font') {
    return vToFont[grade] || grade;
  } else {
    return fontToV[grade] || grade;
  }
}

// --- Canonical Scaffold ---

// We assign incremental canonical values aligned to difficulty order.
// For now we take the intersection order of V scale as backbone and map Font approximate equivalents.

interface CanonicalPair {
  v: string;
  font: string;
  canonical: number; // integer difficulty step
}

const CANONICAL_TABLE: CanonicalPair[] = [
  { v: 'VB', font: '3–4', canonical: 0 },
  { v: 'V0', font: '4–4+', canonical: 1 },
  { v: 'V1', font: '5–5+', canonical: 2 },
  { v: 'V2', font: '5+–6A', canonical: 3 },
  { v: 'V3', font: '6A–6A+', canonical: 4 },
  { v: 'V4', font: '6B–6B+', canonical: 5 },
  { v: 'V5', font: '6C–6C+', canonical: 6 },
  { v: 'V6', font: '7A', canonical: 7 },
  { v: 'V7', font: '7A+', canonical: 8 },
  { v: 'V8', font: '7B', canonical: 9 },
  { v: 'V9', font: '7B+', canonical: 10 },
  { v: 'V10', font: '7C', canonical: 11 },
  { v: 'V11', font: '7C+', canonical: 12 },
  { v: 'V12', font: '8A', canonical: 13 },
  { v: 'V13', font: '8A+', canonical: 14 },
  { v: 'V14', font: '8B', canonical: 15 },
  { v: 'V15', font: '8B+', canonical: 16 },
  { v: 'V16', font: '8C', canonical: 17 },
  { v: 'V17', font: '9A', canonical: 18 },
];

const canonicalByV = Object.fromEntries(CANONICAL_TABLE.map(r => [r.v, r.canonical]));
const canonicalByFont = Object.fromEntries(CANONICAL_TABLE.map(r => [r.font, r.canonical]));

export function toCanonical(grade: string, system: GradeSystem): number | undefined {
  return system === 'V' ? canonicalByV[grade] : canonicalByFont[grade];
}

export function fromCanonical(canonical: number, system: GradeSystem): GradeConversionResult | undefined {
  const pair = CANONICAL_TABLE.find(p => p.canonical === canonical);
  if (!pair) return undefined;
  return {
    systemId: system === 'V' ? 'vscale' : 'font',
    label: system === 'V' ? pair.v : pair.font,
    approximate: false,
  };
}

// Build GradeSystemDefinition representations (builtin).
export const BUILTIN_V_SYSTEM: GradeSystemDefinition = {
  id: 'vscale',
  name: 'V-Scale',
  discipline: 'boulder',
  version: 1,
  scope: 'builtin',
  isDefault: true,
  grades: CANONICAL_TABLE.map(p => ({
    id: p.v,
    label: p.v,
    displayOrder: p.canonical,
    canonicalValue: p.canonical,
  })),
};

export const BUILTIN_FONT_SYSTEM: GradeSystemDefinition = {
  id: 'font',
  name: 'Font',
  discipline: 'boulder',
  version: 1,
  scope: 'builtin',
  grades: CANONICAL_TABLE.map(p => ({
    id: p.font,
    label: p.font,
    displayOrder: p.canonical,
    canonicalValue: p.canonical,
  })),
};

export function listBuiltinSystems(): GradeSystemDefinition[] {
  return [BUILTIN_V_SYSTEM, BUILTIN_FONT_SYSTEM];
}

export function convertLabelBetweenSystems(label: string, from: GradeSystem, to: GradeSystem): string {
  if (from === to) return label;
  const canonical = toCanonical(label, from);
  if (canonical == null) return label; // fallback unknown mapping
  const res = fromCanonical(canonical, to);
  return res?.label || label;
}

// Future: general approximate conversion (non exact canonical match) can search nearest.
