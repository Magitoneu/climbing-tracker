import { buildSessionStats } from '../../src/utils/sessionStats';
import { Attempt } from '../../src/models/Session';

describe('Session Stats', () => {
  it('should calculate volume (total attempts)', () => {
    const boulders: Attempt[] = [
      { grade: 'V4', attempts: 3, flashed: false },
      { grade: 'V5', attempts: 2, flashed: false },
      { grade: 'V3', attempts: 1, flashed: true },
    ];
    const stats = buildSessionStats(boulders, 'V');
    expect(stats.volume).toBe(6); // 3 + 2 + 1
  });

  it('should count number of problems', () => {
    const boulders: Attempt[] = [
      { grade: 'V4', attempts: 3, flashed: false },
      { grade: 'V5', attempts: 2, flashed: false },
    ];
    const stats = buildSessionStats(boulders, 'V');
    expect(stats.problems).toBe(2);
  });

  it('should calculate flash rate correctly', () => {
    const boulders: Attempt[] = [
      { grade: 'V4', attempts: 1, flashed: true },
      { grade: 'V5', attempts: 3, flashed: false },
      { grade: 'V3', attempts: 1, flashed: true },
      { grade: 'V6', attempts: 5, flashed: false },
    ];
    const stats = buildSessionStats(boulders, 'V');
    expect(stats.flashes).toBe(2);
    expect(stats.flashRate).toBe(0.5); // 2/4
  });

  it('should treat single attempts as flashes', () => {
    const boulders: Attempt[] = [{ grade: 'V4', attempts: 1, flashed: false }];
    const stats = buildSessionStats(boulders, 'V');
    expect(stats.flashes).toBe(1); // Implicit flash for single attempt
  });

  it('should handle empty boulder list', () => {
    const stats = buildSessionStats([], 'V');
    expect(stats.volume).toBe(0);
    expect(stats.problems).toBe(0);
    expect(stats.flashes).toBe(0);
    expect(stats.flashRate).toBe(0);
  });

  it('should identify max grade', () => {
    const boulders: Attempt[] = [
      { grade: 'V4', attempts: 1, flashed: true },
      { grade: 'V8', attempts: 5, flashed: false },
      { grade: 'V3', attempts: 1, flashed: true },
    ];
    const stats = buildSessionStats(boulders, 'V');
    expect(stats.maxGrade).toBe('V8');
  });
});
