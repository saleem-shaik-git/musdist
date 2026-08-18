import { Injectable, ForbiddenException } from '@nestjs/common';
import { organizations, organizationMembers, artists, labels } from '@musdist/database';
import type { Database } from '@musdist/database';

@Injectable()
export class OrganizationService {
  constructor(private readonly db: Database) {}

  async create(userId: string, name: string, type: 'artist' | 'label') {
    return this.db.transaction(async (tx) => {
      const [organization] = await tx.insert(organizations).values({ name, type }).returning();
      await tx.insert(organizationMembers).values({ organizationId: organization.id, userId, role: 'owner' });
      return organization;
    });
  }

  async addArtist(userId: string, organizationId: string, stageName: string, legalName: string) {
    await this.requireOwner(userId, organizationId);
    const [artist] = await this.db.insert(artists).values({ organizationId, stageName, legalName }).returning();
    return artist;
  }

  async addLabel(userId: string, organizationId: string, name: string) {
    await this.requireOwner(userId, organizationId);
    const [label] = await this.db.insert(labels).values({ organizationId, name }).returning();
    return label;
  }

  private async requireOwner(userId: string, organizationId: string) {
    const members = await this.db.select().from(organizationMembers);
    const member = members.find((item) => item.organizationId === organizationId && item.userId === userId);
    if (!member || !['owner', 'admin'].includes(member.role)) throw new ForbiddenException('Insufficient organization permissions');
  }
}
