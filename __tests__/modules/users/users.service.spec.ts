import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../src/modules/users/entities/user.entity';
import { UsersService } from '../../../src/modules/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    urls: [],
  } as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const email = 'test@example.com';
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      const email = 'nonexistent@example.com';
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const id = 1;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      const id = 999;
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(id);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const email = 'new@example.com';
      const passwordHash = 'hashedPassword456';
      
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(email, passwordHash);

      expect(userRepository.create).toHaveBeenCalledWith({ email, passwordHash });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
