import type { OrganizationRole } from './auth.types';

export function hasRole(role: OrganizationRole, allowed: readonly OrganizationRole[]): boolean {
  return allowed.includes(role);
}

export function canManageOrganization(role: OrganizationRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canReviewRelease(role: OrganizationRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'reviewer';
}

export function canManageFinance(role: OrganizationRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'finance' || role === 'accountant';
}
