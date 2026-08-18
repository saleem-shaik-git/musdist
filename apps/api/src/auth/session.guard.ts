import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { sessions, users } from '@musdist/database';
import type { Database } from '@musdist/database';
import { SESSION_COOKIE } from './auth.constants';
import { hashToken } from './token';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly db: Database) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ cookies?: Record<string, string>; user?: unknown }>();
    const token = request.cookies?.[SESSION_COOKIE];
    if (!token) throw new UnauthorizedException();
    const now = new Date();
    const rows = await this.db.select({ userId: users.id, email: users.email })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.tokenHash, hashToken(token)), isNull(sessions.revokedAt), gt(sessions.expiresAt, now)))
      .limit(1);
    if (!rows[0]) throw new UnauthorizedException();
    request.user = rows[0];
    return true;
  }
}
