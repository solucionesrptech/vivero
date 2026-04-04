import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { resolveAdminJwtSecret } from './admin-jwt-secret.util';

export type AdminJwtPayload = {
  sub: string;
  email?: string;
  role?: string;
};

@Injectable()
export class AdminJwtService {
  issueAdminAccessToken(payload: { sub: string; email: string }): string {
    return jwt.sign(
      { sub: payload.sub, email: payload.email, role: 'admin' },
      resolveAdminJwtSecret(),
      {
        algorithm: 'HS256',
        expiresIn: '8h',
      },
    );
  }

  verifyAdminAccessToken(token: string): AdminJwtPayload {
    return jwt.verify(token, resolveAdminJwtSecret(), {
      algorithms: ['HS256'],
    }) as AdminJwtPayload;
  }
}
