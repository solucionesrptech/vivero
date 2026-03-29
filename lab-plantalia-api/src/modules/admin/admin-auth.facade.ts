import { Injectable } from '@nestjs/common';
import type { AdminLoginDto } from './dto/admin-login.dto';
import type { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { AdminAuthBll } from './admin-auth.bll';

@Injectable()
export class AdminAuthFacade {
  constructor(private readonly bll: AdminAuthBll) {}

  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    return this.bll.login(dto.email, dto.password);
  }
}
