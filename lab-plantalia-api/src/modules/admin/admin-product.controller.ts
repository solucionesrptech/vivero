import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminProductDomainError } from './admin-product.domain-error';
import { AdminProductFacade } from './admin-product.facade';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { AdminProductRowDto } from './dto/admin-product-row.dto';

@ApiTags('admin-products')
@ApiBearerAuth('admin-jwt')
@UseGuards(AdminJwtGuard)
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly facade: AdminProductFacade) {}

  @Get()
  @ApiOperation({ summary: 'Listado de productos para gestión de stock' })
  @ApiOkResponse({ type: AdminProductRowDto, isArray: true })
  list(): Promise<AdminProductRowDto[]> {
    return this.facade.list();
  }

  @Patch(':productId/stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ajustar stock (suma o resta; mínimo 0)' })
  @ApiOkResponse({ type: AdminProductRowDto })
  async adjustStock(
    @Param('productId') productId: string,
    @Body() dto: AdjustStockDto,
  ): Promise<AdminProductRowDto> {
    try {
      return await this.facade.adjustStock(productId, dto);
    } catch (e) {
      if (e instanceof AdminProductDomainError) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
