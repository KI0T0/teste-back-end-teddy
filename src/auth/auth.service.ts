import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const normalizedEmail = email.toLowerCase().trim();

    this.logger.log(`Processando registro para o email: ${normalizedEmail}`);

    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      this.logger.warn(`Falha no registro: email ${normalizedEmail} já existe`);
      throw new ConflictException('Usuário já existe');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    this.logger.log(`Senha criptografada com sucesso para o email: ${normalizedEmail}`);

    const user = await this.usersService.create(normalizedEmail, passwordHash);
    this.logger.log(`Usuário criado com sucesso com ID: ${user.id}`);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`Processando login para o email: ${email}`);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Falha no login: usuário não encontrado para o email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Falha no login: senha inválida para o email: ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const access_token = this.generateToken(user);
    this.logger.log(`Login realizado com sucesso para o email: ${email}, token gerado`);

    return { access_token };
  }

  private generateToken(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
