import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResponseDto {
  @ApiProperty({ description: 'JWT para cabecera Authorization: Bearer <token>' })
  accessToken: string;
}
