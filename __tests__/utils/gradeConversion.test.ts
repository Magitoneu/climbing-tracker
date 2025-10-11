import { convertGrade, toCanonical, fromCanonical } from '../../src/models/gradeConversion';

describe('Grade Conversion', () => {
  describe('convertGrade', () => {
    it('should convert V-Scale to Font correctly', () => {
      expect(convertGrade('V3', 'Font')).toBe('6A–6A+');
      expect(convertGrade('V5', 'Font')).toBe('6C–6C+');
      expect(convertGrade('V10', 'Font')).toBe('7C');
    });

    it('should convert Font to V-Scale correctly', () => {
      expect(convertGrade('6A', 'V')).toBe('V2');
      expect(convertGrade('7A', 'V')).toBe('V6');
      expect(convertGrade('8A', 'V')).toBe('V12');
    });

    it('should return original grade if no mapping exists', () => {
      expect(convertGrade('UNKNOWN', 'V')).toBe('UNKNOWN');
      expect(convertGrade('UNKNOWN', 'Font')).toBe('UNKNOWN');
    });
  });

  describe('Canonical Value System', () => {
    it('should convert grades to canonical values', () => {
      expect(toCanonical('VB', 'V')).toBe(0);
      expect(toCanonical('V5', 'V')).toBe(6);
      expect(toCanonical('V10', 'V')).toBe(11);
      expect(toCanonical('V17', 'V')).toBe(18);
    });

    it('should convert canonical values back to grades', () => {
      const result = fromCanonical(6, 'V');
      expect(result?.label).toBe('V5');
      expect(result?.approximate).toBe(false);
    });

    it('should preserve grade through canonical roundtrip', () => {
      const grade = 'V7';
      const canonical = toCanonical(grade, 'V');
      const restored = fromCanonical(canonical!, 'V');
      expect(restored?.label).toBe(grade);
    });

    it('should convert between systems using canonical values', () => {
      // V5 -> canonical 6 -> Font '6C–6C+'
      const v5Canonical = toCanonical('V5', 'V');
      const fontEquivalent = fromCanonical(v5Canonical!, 'Font');
      expect(fontEquivalent?.label).toBe('6C–6C+');
    });

    it('should return undefined for unknown grades', () => {
      expect(toCanonical('UNKNOWN', 'V')).toBeUndefined();
      expect(fromCanonical(999, 'V')).toBeUndefined();
    });
  });
});
