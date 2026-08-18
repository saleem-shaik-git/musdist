import { hashPassword, verifyPassword } from './password';

describe('password security', () => {
  it('hashes and verifies a valid password', async () => {
    const hash = await hashPassword('correct horse battery staple');
    expect(hash.startsWith('scrypt$')).toBe(true);
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false);
  });

  it('rejects passwords shorter than 12 characters', async () => {
    await expect(hashPassword('short')).rejects.toThrow('at least 12');
  });
});
