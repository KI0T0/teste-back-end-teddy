import { IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({ 
    example: 'https://novo-exemplo.com', 
    description: 'Nova URL para substituir a atual' 
  })
  @IsUrl({ protocols: ['http', 'https'] })
  @MaxLength(2048, { message: 'URL deve ter no máximo 2048 caracteres' })
  longUrl: string;
}
