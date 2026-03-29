import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductFacade } from './product.facade';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly facade: ProductFacade) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos por categoría' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  list(@Query() query: ProductQueryDto): Promise<ProductResponseDto[]> {
    return this.facade.listByCategory(query);
  }
}
