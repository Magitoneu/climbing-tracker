import { describe, it, expect } from 'vitest';

// Contract test for POST /goals

describe('POST /goals', () => {
  it('should create a new climbing goal', async () => {
    const payload = {
      userId: 'user-123',
      targetDifficulty: 'V7',
      type: 'bouldering',
      timeframe: '2025-12-31',
      progressStatus: 'active',
    };
    // Simulate API call (replace with actual implementation)
    // const response = await api.post('/goals', payload);
    // expect(response.status).toBe(201);
    // expect(response.data).toMatchObject(payload);
    expect(true).toBe(false); // Test must fail before implementation
  });
});
