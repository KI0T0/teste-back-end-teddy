import { IsUrl, MaxLength } from 'class-validator';

export class UpdateUrlDto {
  @IsUrl({ protocols: ['http', 'https'] })
  @MaxLength(2048, { message: 'URL deve ter no máximo 2048 caracteres' })
  longUrl: string;
}
