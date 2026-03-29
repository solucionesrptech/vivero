import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AdminAuthDal } from './admin-auth.dal';
import { AdminAuthDomainError } from './admin-auth.domain-error';
import { resolveAdminJwtSecret } from './admin-jwt-secret.util';

export type AdminLoginResult = { accessToken: string };

@Injectable()
export class AdminAuthBll {
  constructor(private readonly dal: AdminAuthDal) {}

  async login(email: string, password: string): Promise<AdminLoginResult> {
    const normalized = email.toLowerCase().trim();
    const user = await this.dal.findByEmail(normalized);
    if (!user) {
      throw new AdminAuthDomainError(
        'INVALID_CREDENTIALS',
        'Credenciales incorrectas',
      );
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new AdminAuthDomainError(
        'INVALID_CREDENTIALS',
        'Credenciales incorrectas',
      );
    }
    const secret = resolveAdminJwtSecret();
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: 'admin' },
      secret,
      { expiresIn: '8h' },
    );
    return { accessToken };
  }
}
