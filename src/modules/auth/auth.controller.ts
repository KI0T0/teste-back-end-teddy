import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Tentativa de registro de usuário com email: ${registerDto.email}`);

    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(`Usuário registrado com sucesso: ${result.user.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Falha no registro para o email: ${registerDto.email}`);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica um usuário existente' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentativa de login para o usuário: ${loginDto.email}`);

    try {
      const result = await this.authService.login(loginDto);
      this.logger.log(`Usuário logado com sucesso: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Falha no login para o email: ${loginDto.email}`, error.stack);
      throw error;
    }
  }
}
