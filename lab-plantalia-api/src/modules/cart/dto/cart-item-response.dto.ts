import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Precio unitario en CLP (entero)' })
  unitPrice: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ description: 'Subtotal de línea en CLP' })
  lineSubtotal: number;

  @ApiProperty({
    description: 'Stock actual del producto en inventario (límite máximo en carrito)',
  })
  stock: number;
}
