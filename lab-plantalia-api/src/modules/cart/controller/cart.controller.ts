import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CartDomainExceptionFilter } from './cart-domain-exception.filter';
import { CartCheckoutRateLimitGuard } from './cart-checkout-rate-limit.guard';
import { CartFacade } from '../facade/cart.facade';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { CartResponseDto } from '../dto/cart-response.dto';
import { CartIdQueryDto } from '../dto/cart-id-query.dto';
import { CheckoutCartDto } from '../dto/checkout-cart.dto';
import { CheckoutResponseDto } from '../dto/checkout-response.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@ApiTags('cart')
@UseFilters(CartDomainExceptionFilter)
@Controller('cart')
export class CartController {
  constructor(private readonly facade: CartFacade) {}

  @Post('items')
  @ApiOperation({ summary: 'Agregar producto al carrito (crea carrito si no se envía cartId)' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiBadRequestResponse({ description: 'Cantidad u otros datos inválidos' })
  @ApiNotFoundResponse({ description: 'Producto o carrito no encontrado' })
  addItem(@Body() dto: AddCartItemDto): Promise<CartResponseDto> {
    return this.facade.addItem(dto);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CartCheckoutRateLimitGuard)
  @ApiOperation({
    summary:
      'Checkout: datos de entrega, valida stock, crea pedido y vacía el carrito',
  })
  @ApiOkResponse({ type: CheckoutResponseDto })
  @ApiBadRequestResponse({
    description: 'Stock insuficiente, carrito vacío o datos de checkout inválidos',
  })
  @ApiNotFoundResponse({ description: 'Carrito no encontrado' })
  checkout(@Body() dto: CheckoutCartDto): Promise<CheckoutResponseDto> {
    return this.facade.checkout(dto);
  }

  @Get('current')
  @ApiOperation({ summary: 'Obtener carrito por query cartId (alias de GET /cart/:cartId)' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse()
  getCurrent(@Query() query: CartIdQueryDto): Promise<CartResponseDto> {
    return this.facade.getCart(query.cartId);
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Obtener carrito por id' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse()
  getCart(
    @Param('cartId', new ParseUUIDPipe({ version: '4' })) cartId: string,
  ): Promise<CartResponseDto> {
    return this.facade.getCart(cartId);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Actualizar cantidad de una línea' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  updateItem(
    @Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string,
    @Query() query: CartIdQueryDto,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.facade.updateItem(itemId, query.cartId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Eliminar línea del carrito' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse()
  removeItem(
    @Param('itemId', new ParseUUIDPipe({ version: '4' })) itemId: string,
    @Query() query: CartIdQueryDto,
  ): Promise<CartResponseDto> {
    return this.facade.removeItem(itemId, query.cartId);
  }
}
