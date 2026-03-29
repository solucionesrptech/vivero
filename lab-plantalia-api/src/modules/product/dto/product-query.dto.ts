import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({
    example: 'philodendros',
    description: 'Identificador de categoría (mismo valor que categoryId en BD)',
  })
  @IsString()
  @IsNotEmpty()
  categorySlug: string;
}
