import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ protocols: ['http', 'https'] })
  longUrl: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{1,6}$/, {
    message: 'Alias personalizado deve ter 1-6 caracteres e conter apenas letras, números, hífen e underscore',
  })
  customAlias?: string;
}
