import { ApiProperty } from '@nestjs/swagger';
import { CartResponseDto } from './cart-response.dto';
import { CheckoutOrderResponseDto } from './checkout-order-response.dto';

export class CheckoutResponseDto {
  @ApiProperty({ type: CartResponseDto })
  cart: CartResponseDto;

  @ApiProperty({ type: CheckoutOrderResponseDto })
  order: CheckoutOrderResponseDto;
}
