import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { consumeIpRateLimit } from '../../../common/ip-rate-limit.util';

const ORDER_LOOKUP_MAX_ATTEMPTS = 12;
const ORDER_LOOKUP_WINDOW_MS = 60 * 1000;

@Injectable()
export class OrderLookupRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const allowed = consumeIpRateLimit(
      req,
      'order-lookup',
      ORDER_LOOKUP_MAX_ATTEMPTS,
      ORDER_LOOKUP_WINDOW_MS,
    );
    if (!allowed) {
      throw new HttpException(
        'Demasiadas consultas de pedido en poco tiempo. Espera un minuto antes de reintentar.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
