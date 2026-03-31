import { ApiProperty } from '@nestjs/swagger';

export class TopProductSoldResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty({ description: 'Unidades vendidas (órdenes confirmadas)' })
  totalQuantitySold: number;

  @ApiProperty({ description: 'Ingresos en la misma unidad que price del catálogo (ej. CLP entero)' })
  totalRevenue: number;
}
