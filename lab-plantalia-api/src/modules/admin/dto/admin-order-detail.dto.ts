import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminOrderItemDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  lineSubtotal: number;
}

export class AdminOrderDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  publicCode: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  deliveryType: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerPhone: string;

  @ApiPropertyOptional()
  deliveryAddress: string | null;

  @ApiProperty({ type: [AdminOrderItemDto] })
  items: AdminOrderItemDto[];

  @ApiProperty({
    description: 'Estados a los que se puede avanzar con PATCH (botones en UI)',
    type: [String],
  })
  allowedNextStatuses: string[];
}
