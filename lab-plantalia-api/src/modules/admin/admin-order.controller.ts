import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminOrderDomainError } from './admin-order.domain-error';
import { AdminOrderFacade } from './admin-order.facade';
import { AdminOrderDetailDto } from './dto/admin-order-detail.dto';
import { AdminOrderListRowDto } from './dto/admin-order-list-row.dto';
import { PatchAdminOrderStatusDto } from './dto/patch-admin-order-status.dto';

@ApiTags('admin-orders')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly facade: AdminOrderFacade) {}

  @Get()
  @ApiOperation({ summary: 'Listado de pedidos (más recientes primero)' })
  @ApiOkResponse({ type: AdminOrderListRowDto, isArray: true })
  list(): Promise<AdminOrderListRowDto[]> {
    return this.facade.list();
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Detalle de pedido para operación' })
  @ApiOkResponse({ type: AdminOrderDetailDto })
  async getOne(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
  ): Promise<AdminOrderDetailDto> {
    try {
      return await this.facade.getById(orderId);
    } catch (e) {
      if (e instanceof AdminOrderDomainError && e.code === 'ORDER_NOT_FOUND') {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @Patch(':orderId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Avanzar estado del pedido (transición válida)' })
  @ApiOkResponse({ type: AdminOrderDetailDto })
  async patchStatus(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Body() dto: PatchAdminOrderStatusDto,
  ): Promise<AdminOrderDetailDto> {
    try {
      return await this.facade.patchStatus(orderId, dto.status);
    } catch (e) {
      if (e instanceof AdminOrderDomainError) {
        if (e.code === 'ORDER_NOT_FOUND') {
          throw new NotFoundException(e.message);
        }
        if (e.code === 'INVALID_STATUS_TRANSITION') {
          throw new BadRequestException(e.message);
        }
      }
      throw e;
    }
  }
}
