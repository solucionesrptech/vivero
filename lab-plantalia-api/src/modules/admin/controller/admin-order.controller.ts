import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminDomainExceptionFilter } from './admin-domain-exception.filter';
import { AdminOrderFacade } from '../facade/admin-order.facade';
import { AdminOrderDetailDto } from '../dto/admin-order-detail.dto';
import { AdminOrderListRowDto } from '../dto/admin-order-list-row.dto';
import { PatchAdminOrderStatusDto } from '../dto/patch-admin-order-status.dto';

@ApiTags('admin-orders')
@ApiBearerAuth('admin-jwt')
@UseFilters(AdminDomainExceptionFilter)
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
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<AdminOrderDetailDto> {
    return this.facade.getById(orderId);
  }

  @Patch(':orderId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Avanzar estado del pedido (transición válida)' })
  @ApiOkResponse({ type: AdminOrderDetailDto })
  async patchStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: PatchAdminOrderStatusDto,
  ): Promise<AdminOrderDetailDto> {
    return this.facade.patchStatus(orderId, dto.status);
  }
}
