import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductFeaturedQueryDto } from './dto/product-featured-query.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductFacade } from './product.facade';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly facade: ProductFacade) {}

  @Get('featured')
  @ApiOperation({
    summary: 'Productos activos destacados (p. ej. home), más recientes primero',
  })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  listFeatured(
    @Query() query: ProductFeaturedQueryDto,
  ): Promise<ProductResponseDto[]> {
    const limit = query.limit ?? 6;
    return this.facade.listFeatured(limit);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos por categoría' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  list(@Query() query: ProductQueryDto): Promise<ProductResponseDto[]> {
    return this.facade.listByCategory(query);
  }
}
