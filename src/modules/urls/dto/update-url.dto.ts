import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({ example: 'https://novo-destino.com/page' })
  @IsString()
  @IsUrl()
  longUrl: string;
}
