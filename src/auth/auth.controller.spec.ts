import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let _usersService: UsersService;
  let _userRepository: jest.Mocked<Repository<UserEntity>>;
  let _jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    urls: [],
  };

  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    _usersService = module.get<UsersService>(UsersService);
    _userRepository = module.get(getRepositoryToken(UserEntity));
    _jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const expectedResult = {
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle registration failure and rethrow error', async () => {
      const conflictError = new ConflictException('User already exists');
      jest.spyOn(authService, 'register').mockRejectedValue(conflictError);

      await expect(controller.register(mockRegisterDto)).rejects.toThrow(ConflictException);
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
    });
  });

  describe('login', () => {
    it('should login user successfully and return access token', async () => {
      const expectedResult = {
        access_token: mockJwtToken,
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle login failure and rethrow error', async () => {
      const unauthorizedError = new UnauthorizedException('Invalid credentials');
      jest.spyOn(authService, 'login').mockRejectedValue(unauthorizedError);

      await expect(controller.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });
});
