import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthDomainError } from './admin-auth.domain-error';
import { AdminAuthFacade } from './admin-auth.facade';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  private readonly logger = new Logger(AdminAuthController.name);

  constructor(private readonly facade: AdminAuthFacade) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión administrador (entorno de prueba)' })
  @ApiOkResponse({ type: AdminLoginResponseDto })
  async login(@Body() dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    try {
      return await this.facade.login(dto);
    } catch (e) {
      if (e instanceof AdminAuthDomainError) {
        throw new UnauthorizedException(e.message);
      }
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.error(`Login admin falló: ${msg}`, e instanceof Error ? e.stack : undefined);
      if (process.env.NODE_ENV !== 'production') {
        throw new InternalServerErrorException(msg);
      }
      throw new InternalServerErrorException('Error interno al iniciar sesión');
    }
  }
}
