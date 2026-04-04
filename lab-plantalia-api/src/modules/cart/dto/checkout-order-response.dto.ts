import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryType } from '@prisma/client';
import { CheckoutOrderLineResponseDto } from './checkout-order-line-response.dto';

export class CheckoutOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Código público del pedido (consulta / referencia)' })
  publicCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;

  @ApiProperty({ enum: DeliveryType, enumName: 'DeliveryType' })
  deliveryType: DeliveryType;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerPhone: string;

  @ApiPropertyOptional()
  deliveryAddress: string | null;

  @ApiProperty({ type: [CheckoutOrderLineResponseDto] })
  lines: CheckoutOrderLineResponseDto[];
}
