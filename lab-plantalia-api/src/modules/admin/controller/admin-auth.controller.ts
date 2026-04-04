import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthFacade } from '../facade/admin-auth.facade';
import { AdminDomainExceptionFilter } from './admin-domain-exception.filter';
import { AdminLoginRateLimitGuard } from './admin-login-rate-limit.guard';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminLoginResponseDto } from '../dto/admin-login-response.dto';

@ApiTags('admin-auth')
@UseFilters(AdminDomainExceptionFilter)
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly facade: AdminAuthFacade) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminLoginRateLimitGuard)
  @ApiOperation({ summary: 'Inicio de sesión administrador (entorno de prueba)' })
  @ApiOkResponse({ type: AdminLoginResponseDto })
  async login(@Body() dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    return this.facade.login(dto);
  }
}
