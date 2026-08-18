import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SESSION_COOKIE } from './auth.constants';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

type CredentialsBody = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: CredentialsBody) {
    if (!body?.email || !body?.password) throw new UnauthorizedException('Email and password are required');
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: CredentialsBody, @Res({ passthrough: true }) response: Response) {
    if (!body?.email || !body?.password) throw new UnauthorizedException('Email and password are required');
    const user = await this.auth.authenticate(body.email, body.password);
    const session = this.auth.createSessionToken();
    response.cookie(SESSION_COOKIE, session.token, { ...cookieOptions, maxAge: session.expiresAt.getTime() - Date.now() });
    return { user };
  }

  @Get('me')
  me(@Req() request: Request) {
    if (!request.user) throw new UnauthorizedException();
    return request.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(SESSION_COOKIE, cookieOptions);
    return { success: true };
  }

  @Get('status')
  status() {
    return { service: 'auth', status: 'ready', phase: 'phase-1-identity-rbac' };
  }
}
