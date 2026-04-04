import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { consumeIpRateLimit } from '../../../common/ip-rate-limit.util';

const CART_CHECKOUT_MAX_ATTEMPTS = 5;
const CART_CHECKOUT_WINDOW_MS = 5 * 60 * 1000;

@Injectable()
export class CartCheckoutRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const allowed = consumeIpRateLimit(
      req,
      'cart-checkout',
      CART_CHECKOUT_MAX_ATTEMPTS,
      CART_CHECKOUT_WINDOW_MS,
    );
    if (!allowed) {
      throw new HttpException(
        'Demasiados intentos de checkout en poco tiempo. Espera unos minutos antes de reintentar.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
