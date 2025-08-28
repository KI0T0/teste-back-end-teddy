import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ 
    example: 'https://exemplo.com', 
    description: 'URL original a ser encurtada' 
  })
  @IsUrl({ protocols: ['http', 'https'] })
  longUrl: string;

  @ApiPropertyOptional({ 
    example: 'meuAlias', 
    description: 'Alias personalizado (1-6 caracteres alfanuméricos)' 
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{1,6}$/, {
    message: 'Alias personalizado deve ter 1-6 caracteres e conter apenas letras, números, hífen e underscore',
  })
  customAlias?: string;
}
