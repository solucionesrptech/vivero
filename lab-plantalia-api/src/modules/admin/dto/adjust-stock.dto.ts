import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({
    description: 'Cambio de stock (positivo suma, negativo resta). El resultado no baja de 0.',
    example: 1,
  })
  @IsInt()
  delta: number;
}
