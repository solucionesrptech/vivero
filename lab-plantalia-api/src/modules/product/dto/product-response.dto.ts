import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ description: 'Precio en CLP (entero)' })
  price: number;

  @ApiProperty()
  imageSrc: string;

  @ApiProperty()
  imageAlt: string;

  @ApiProperty({ description: 'Unidades disponibles' })
  stock: number;
}
