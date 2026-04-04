import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderLookupQueryDto } from '../dto/order-lookup-query.dto';
import { OrderLookupResponseDto } from '../dto/order-lookup-response.dto';
import { OrderLookupExceptionFilter } from './order-lookup-exception.filter';
import { OrderLookupFacade } from '../facade/order-lookup.facade';
import { OrderLookupRateLimitGuard } from './order-lookup-rate-limit.guard';

@ApiTags('orders')
@UseFilters(OrderLookupExceptionFilter)
@Controller('orders')
export class OrderLookupController {
  constructor(private readonly facade: OrderLookupFacade) {}

  @Get('lookup')
  @UseGuards(OrderLookupRateLimitGuard)
  @ApiOperation({ summary: 'Consultar pedido por código público y teléfono' })
  @ApiOkResponse({ type: OrderLookupResponseDto })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  lookup(@Query() query: OrderLookupQueryDto): Promise<OrderLookupResponseDto> {
    return this.facade.lookup(query.publicCode, query.phone);
  }
}
