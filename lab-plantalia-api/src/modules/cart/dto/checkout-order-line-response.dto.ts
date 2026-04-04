import { ApiProperty } from '@nestjs/swagger';

export class CheckoutOrderLineResponseDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ description: 'Subtotal de la línea en CLP' })
  lineSubtotal: number;
}
