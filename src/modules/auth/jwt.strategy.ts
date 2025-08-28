import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Strategy - Payload recebido:', payload);
    const user = await this.usersService.findById(payload.sub);
    console.log('JWT Strategy - Usuário encontrado:', user);
    if (!user) {
      console.log('JWT Strategy - Usuário não encontrado');
      return null;
    }
    const result = {
      id: user.id,
      email: user.email,
    };
    console.log('JWT Strategy - Retornando:', result);
    return result;
  }
}
