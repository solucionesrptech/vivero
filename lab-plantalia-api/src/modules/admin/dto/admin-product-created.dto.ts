import { ApiProperty } from '@nestjs/swagger';

export class AdminProductCreatedDto {
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

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  imageSrc: string;

  @ApiProperty()
  imageAlt: string;

  @ApiProperty()
  isActive: boolean;
}
