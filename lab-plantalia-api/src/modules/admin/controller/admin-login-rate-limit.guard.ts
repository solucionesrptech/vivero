import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { consumeIpRateLimit } from '../../../common/ip-rate-limit.util';

const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
const ADMIN_LOGIN_WINDOW_MS = 10 * 60 * 1000;

@Injectable()
export class AdminLoginRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const allowed = consumeIpRateLimit(
      req,
      'admin-login',
      ADMIN_LOGIN_MAX_ATTEMPTS,
      ADMIN_LOGIN_WINDOW_MS,
    );
    if (!allowed) {
      throw new HttpException(
        'Demasiados intentos de inicio de sesión. Intenta nuevamente en unos minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
