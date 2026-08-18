import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('status')
  status() {
    return {
      service: 'auth',
      status: 'ready',
      phase: 'phase-1-identity-rbac',
    };
  }
}
