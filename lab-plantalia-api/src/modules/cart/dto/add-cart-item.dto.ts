import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 'p1', description: 'ID del producto en catálogo' })
  @IsString()
  @MaxLength(64)
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'ID de carrito existente; si se omite se crea uno nuevo',
  })
  @IsOptional()
  @IsUUID('4')
  cartId?: string;
}
