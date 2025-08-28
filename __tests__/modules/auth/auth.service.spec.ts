import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../src/modules/users/entities/user.entity';
import { UsersService } from '../../../src/modules/users/users.service';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let _userRepository: jest.Mocked<Repository<UserEntity>>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    urls: [],
  } as UserEntity;

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
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    _userRepository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = { ...mockUser, passwordHash: hashedPassword };

      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(createdUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.register(mockRegisterDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockRegisterDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto.email, hashedPassword);
      expect(result).toEqual({
        user: {
          id: createdUser.id,
          email: createdUser.email,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as UserEntity);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(ConflictException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockRegisterDto.email);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully and return access token', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockJwtToken);

      const result = await service.login(mockLoginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.password, mockUser.passwordHash);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: mockJwtToken });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.password, mockUser.passwordHash);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
