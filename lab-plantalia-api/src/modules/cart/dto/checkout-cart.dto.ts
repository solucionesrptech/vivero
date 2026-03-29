import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CheckoutCartDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  cartId: string;
}
