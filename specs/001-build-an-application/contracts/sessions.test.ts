import { describe, it, expect } from 'vitest';

// Contract test for POST /sessions

describe('POST /sessions', () => {
  it('should create a new climbing session', async () => {
    // Simulate request payload
    const payload = {
      userId: 'user-123',
      date: '2025-09-13',
      location: 'Local Gym',
      type: 'bouldering',
      difficulty: 'V5',
      notes: 'Felt strong today',
    };
    // Simulate API call (replace with actual implementation)
    // const response = await api.post('/sessions', payload);
    // expect(response.status).toBe(201);
    // expect(response.data).toMatchObject(payload);
    expect(true).toBe(false); // Test must fail before implementation
  });
});
