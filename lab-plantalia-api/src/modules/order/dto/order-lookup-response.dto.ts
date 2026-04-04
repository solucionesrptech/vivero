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
  publicCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  deliveryType: string;

  @ApiPropertyOptional()
  deliveryAddress: string | null;

  @ApiProperty({ type: [OrderLookupItemResponseDto] })
  items: OrderLookupItemResponseDto[];
}
