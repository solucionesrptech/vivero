import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { resolveAdminJwtSecret } from './admin-jwt-secret.util';

type JwtAdminPayload = {
  sub: string;
  email?: string;
  role?: string;
};

@Injectable()
export class AdminJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }
    const token = header.slice(7).trim();
    let secret: string;
    try {
      secret = resolveAdminJwtSecret();
    } catch {
      throw new UnauthorizedException('Servidor sin configurar JWT');
    }
    try {
      const payload = jwt.verify(token, secret) as JwtAdminPayload;
      if (payload.role !== 'admin' || !payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
