import { Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from '@musdist/database';
import type { Database } from '@musdist/database';
import { hashPassword, verifyPassword } from './password';
import { SESSION_TTL_SECONDS } from './auth.constants';
import { createSessionToken, hashToken } from './token';

function normalizeEmail(email: string): string { return email.trim().toLowerCase(); }

@Injectable()
export class AuthService {
  constructor(private readonly db: Database) {}

  async register(email: string, password: string) {
    const normalized = normalizeEmail(email);
    const existing = await this.db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).limit(1);
    if (existing.length) throw new UnauthorizedException('Unable to create account');
    const [user] = await this.db.insert(users).values({ email: normalized, passwordHash: await hashPassword(password) }).returning({ id: users.id, email: users.email });
    return user;
  }

  async authenticate(email: string, password: string) {
    const normalized = normalizeEmail(email);
    const rows = await this.db.select().from(users).where(eq(users.email, normalized)).limit(1);
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
    return { id: user.id, email: user.email };
  }

  createSessionToken(): { token: string; tokenHash: string; expiresAt: Date } {
    const token = createSessionToken();
    return { token, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000) };
  }
}
