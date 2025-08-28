import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'usuario@exemplo.com', 
    description: 'Email do usuário para registro' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'senha123456', 
    description: 'Senha do usuário (mínimo 8 caracteres)' 
  })
  @IsString()
  @MinLength(8)
  password: string;
}
