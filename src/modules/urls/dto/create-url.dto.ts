import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://exemplo.com/pagina' })
  @IsString()
  @IsUrl()
  longUrl: string;
}
