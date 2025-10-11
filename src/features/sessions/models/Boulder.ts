// Phase 1 expanded Boulder model.
// Backwards compatibility: existing code may still set `grade` as a plain string.
// New fields (`gradeSnapshot`, `canonicalValue`) will be gradually adopted.
import { BoulderGradeSnapshot } from '../../grades/models/GradeSystem';

export interface Boulder {
  // Legacy simple grade label (retain temporarily for migration/UI simplicity)
  grade: string;
  // New structured snapshot (optional until migration done)
  gradeSnapshot?: BoulderGradeSnapshot;
  // Direct canonical value duplication for fast filtering (mirrors gradeSnapshot.canonicalValue)
  canonicalValue?: number;
  flashed: boolean;
  attempts?: number;
}
