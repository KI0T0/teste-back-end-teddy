import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
