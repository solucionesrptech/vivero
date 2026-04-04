import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminAuthDal } from '../dal/admin-auth.dal';
import { AdminAuthDomainError } from './admin-auth.domain-error';
import { AdminJwtService } from '../controller/admin-jwt.service';

export type AdminLoginResult = { accessToken: string };

@Injectable()
export class AdminAuthBll {
  constructor(
    private readonly dal: AdminAuthDal,
    private readonly adminJwtService: AdminJwtService,
  ) {}

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
    const accessToken = this.adminJwtService.issueAdminAccessToken({
      sub: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
