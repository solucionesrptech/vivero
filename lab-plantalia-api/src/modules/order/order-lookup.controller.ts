import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderLookupQueryDto } from './dto/order-lookup-query.dto';
import { OrderLookupResponseDto } from './dto/order-lookup-response.dto';
import { OrderLookupExceptionFilter } from './order-lookup-exception.filter';
import { OrderLookupFacade } from './order-lookup.facade';

@ApiTags('orders')
@UseFilters(OrderLookupExceptionFilter)
@Controller('orders')
export class OrderLookupController {
  constructor(private readonly facade: OrderLookupFacade) {}

  @Get('lookup')
  @ApiOperation({ summary: 'Consultar pedido por código público y teléfono' })
  @ApiOkResponse({ type: OrderLookupResponseDto })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  lookup(@Query() query: OrderLookupQueryDto): Promise<OrderLookupResponseDto> {
    return this.facade.lookup(query.publicCode, query.phone);
  }
}
