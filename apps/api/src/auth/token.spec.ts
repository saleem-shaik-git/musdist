import { createSessionToken, hashToken } from './token';

describe('session tokens', () => {
  it('creates high-entropy tokens', () => {
    const first = createSessionToken();
    const second = createSessionToken();
    expect(first).not.toEqual(second);
    expect(first.length).toBeGreaterThanOrEqual(40);
    expect(hashToken(first)).toHaveLength(64);
  });
});
