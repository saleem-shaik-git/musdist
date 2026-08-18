import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { SessionGuard } from './session.guard';
import { OrganizationService } from './organization.service';
import { CreateArtistDto, CreateLabelDto, CreateOrganizationDto } from './dto';

type AuthRequest = Request & { user: { id: string } };

@Controller('organizations')
@UseGuards(SessionGuard)
export class OrganizationController {
  constructor(private readonly organizations: OrganizationService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() body: CreateOrganizationDto) {
    return this.organizations.create(req.user.id, body.name, body.type);
  }

  @Post('artist')
  artist(@Req() req: AuthRequest, @Body() body: CreateArtistDto) {
    const organizationId = String(req.headers['x-organization-id'] ?? '');
    return this.organizations.addArtist(req.user.id, organizationId, body.stageName, body.legalName);
  }

  @Post('label')
  label(@Req() req: AuthRequest, @Body() body: CreateLabelDto) {
    const organizationId = String(req.headers['x-organization-id'] ?? '');
    return this.organizations.addLabel(req.user.id, organizationId, body.name);
  }
}
