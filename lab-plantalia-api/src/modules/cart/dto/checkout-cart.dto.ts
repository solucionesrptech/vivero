import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryType } from '@prisma/client';
import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CheckoutCartDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  cartId: string;

  @ApiProperty({ enum: DeliveryType, enumName: 'DeliveryType' })
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  customerName: string;

  @ApiProperty({ maxLength: 32 })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  customerPhone: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @ValidateIf((o: CheckoutCartDto) => o.deliveryType === DeliveryType.DELIVERY)
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  deliveryAddress?: string;
}
