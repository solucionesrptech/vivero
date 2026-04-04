import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PLANTALIA_CATEGORY_SLUGS } from '../constants/plantalia-category-slugs';

export class CreateAdminProductDto {
  @ApiProperty({ example: 'Monstera delicia' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'Planta de interior con hojas perforadas.' })
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  description: string;

  @ApiProperty({ example: 15990, description: 'Precio en CLP, entero > 0' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  price: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'philodendros',
    enum: PLANTALIA_CATEGORY_SLUGS,
    description: 'Slug de categoría (igual que en el catálogo)',
  })
  @IsString()
  @IsIn([...PLANTALIA_CATEGORY_SLUGS])
  category: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b',
    description: 'URL pública de la imagen',
  })
  @IsString()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MinLength(1)
  @MaxLength(2048)
  imageUrl: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
