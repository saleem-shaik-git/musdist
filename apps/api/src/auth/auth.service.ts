import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  validateUser(user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
