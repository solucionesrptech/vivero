import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtGuard } from '../../admin/controller/admin-jwt.guard';
import { AnalyticsFacade } from '../facade/analytics.facade';
import { TopProductSoldResponseDto } from '../dto/top-product-sold-response.dto';

@ApiTags('analytics')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly facade: AnalyticsFacade) {}

  @Get('top-products')
  @ApiOperation({
    summary: 'Top productos vendidos (órdenes confirmadas, máx. 10)',
  })
  @ApiOkResponse({ type: TopProductSoldResponseDto, isArray: true })
  topProducts(): Promise<TopProductSoldResponseDto[]> {
    return this.facade.topProductsSold();
  }
}
