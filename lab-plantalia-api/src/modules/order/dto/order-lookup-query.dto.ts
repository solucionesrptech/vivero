import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class OrderLookupQueryDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  publicCode: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  phone: string;
}
