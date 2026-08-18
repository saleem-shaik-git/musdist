import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { SessionGuard } from './session.guard';
import { OrganizationService } from './organization.service';
import { CreateArtistDto, CreateLabelDto, CreateOrganizationDto } from './dto';

@Controller('organizations')
@UseGuards(SessionGuard)
export class OrganizationController {
  constructor(private readonly organizations: OrganizationService) {}

  @Post()
  create(@Req() req: Request & { user: { userId: string } }, @Body() body: CreateOrganizationDto) {
    return this.organizations.create(req.user.userId, body.name, body.type);
  }

  @Post('artist')
  artist(@Req() req: Request & { user: { userId: string } }, @Body() body: CreateArtistDto) {
    const organizationId = String(req.headers['x-organization-id'] ?? '');
    return this.organizations.addArtist(req.user.userId, organizationId, body.stageName, body.legalName);
  }

  @Post('label')
  label(@Req() req: Request & { user: { userId: string } }, @Body() body: CreateLabelDto) {
    const organizationId = String(req.headers['x-organization-id'] ?? '');
    return this.organizations.addLabel(req.user.userId, organizationId, body.name);
  }
}
