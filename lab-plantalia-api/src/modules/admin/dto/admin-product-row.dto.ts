import { ApiProperty } from '@nestjs/swagger';

export class AdminProductRowDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stock: number;
}
