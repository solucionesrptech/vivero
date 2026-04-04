import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminJwtService } from './admin-jwt.service';
import { AdminJwtConfigError } from './admin-jwt-secret.util';

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(private readonly adminJwtService: AdminJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }
    const token = header.slice(7).trim();
    try {
      const payload = this.adminJwtService.verifyAdminAccessToken(token);
      if (payload.role !== 'admin' || !payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }
      return true;
    } catch (err) {
      if (err instanceof AdminJwtConfigError) {
        throw new UnauthorizedException('Servidor sin configurar JWT');
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
