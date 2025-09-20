// Phase 1 scaffold for unified grade system handling.
// Future phases will add persistence, custom user systems, and versioning.

export interface GradeEntry {
  id: string; // stable within a system version
  label: string;
  displayOrder: number;
  canonicalValue: number; // single representative difficulty point
  canonicalLow?: number; // for range-based grades (optional)
  canonicalHigh?: number; // for range-based grades (optional)
  aliases?: string[];
  color?: string; // for color-coded gym systems
  approximate?: boolean; // true if derived or merged range
}

export interface GradeSystemDefinition {
  id: string; // e.g., 'vscale', 'font'
  name: string; // Human friendly name
  discipline: 'boulder' | 'route';
  version: number; // increment when structure changes
  scope: 'builtin' | 'user';
  grades: GradeEntry[];
  isDefault?: boolean; // user preference for display
  active?: boolean; // false if deprecated but still referenced historically
}

export interface BoulderGradeSnapshot {
  originalSystemId: string; // system id when logged
  originalSystemVersion: number;
  originalLabel: string; // label entered or selected
  canonicalValue: number; // normalized difficulty point
  canonicalLow?: number; // optional range lower bound
  canonicalHigh?: number; // optional range upper bound
}

export interface GradeConversionResult {
  label: string;
  approximate: boolean;
  systemId: string;
}

export interface GradeSystemCache {
  systems: Record<string, GradeSystemDefinition>;
  // convenience flattened lookup: systemId -> sorted grade entries
  sorted: Record<string, GradeEntry[]>;
}
