import { Controller, Get, Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Controller('health')
class HealthController {
  @Get()
  health() {
    return { status: 'ok', service: 'musdist-api', version: 'v1' };
  }
}

@Module({
  imports: [AuthModule],
  controllers: [HealthController, AuthController],
})
export class AppModule {}
