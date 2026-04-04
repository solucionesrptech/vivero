import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderListLineDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;
}

export class AdminOrderListRowDto {
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

  @ApiProperty({ type: [AdminOrderListLineDto] })
  items: AdminOrderListLineDto[];
}
