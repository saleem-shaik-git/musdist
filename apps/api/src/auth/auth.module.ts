import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  controllers: [AuthController, OrganizationController],
  providers: [AuthService, SessionGuard, OrganizationService],
  exports: [AuthService, SessionGuard, OrganizationService],
})
export class AuthModule {}
