export const USER_ROLES = ['owner', 'admin', 'manager', 'artist', 'accountant', 'reviewer', 'support', 'finance', 'super_admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORGANIZATION_ROLES = ['owner', 'admin', 'manager', 'artist', 'accountant', 'reviewer', 'support', 'finance'] as const;
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export type AuthenticatedUser = {
  id: string;
  email: string;
  organizationId: string;
  role: OrganizationRole;
};
