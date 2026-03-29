import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CartIdQueryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  cartId: string;
}
