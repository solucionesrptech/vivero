import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@plantalia.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ClaveSegura123!' })
  @IsString()
  @MinLength(1)
  password: string;
}
