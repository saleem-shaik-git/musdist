import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { OrganizationRole } from '../auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: readonly OrganizationRole[] = []) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.allowedRoles.length === 0) return true;
    const request = context.switchToHttp().getRequest<{ user?: { role?: OrganizationRole } }>();
    const role = request.user?.role;
    return role !== undefined && this.allowedRoles.includes(role);
  }
}
