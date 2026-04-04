import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderLookupItemResponseDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  lineSubtotal: number;
}

export class OrderLookupResponseDto {
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

  @ApiProperty({ type: [OrderLookupItemResponseDto] })
  items: OrderLookupItemResponseDto[];
}
