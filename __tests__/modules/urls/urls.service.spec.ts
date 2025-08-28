import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from '../../../src/modules/urls/dto/create-url.dto';
import { UpdateUrlDto } from '../../../src/modules/urls/dto/update-url.dto';
import { UrlEntity } from '../../../src/modules/urls/entities/url.entity';
import { UrlsService } from '../../../src/modules/urls/urls.service';

const createMockRequest = (user?: { id: number; email: string }) => ({
  user,
  get: jest.fn(),
  header: jest.fn(),
  accepts: jest.fn(),
  acceptsCharsets: jest.fn(),
  acceptsEncodings: jest.fn(),
  acceptsLanguages: jest.fn(),
  range: jest.fn(),
  accepted: jest.fn(),
  param: jest.fn(),
  is: jest.fn(),
  protocol: 'http',
  secure: false,
  ip: '127.0.0.1',
  ips: [],
  subdomains: [],
  path: '/',
  hostname: 'localhost',
  host: 'localhost:3000',
  fresh: false,
  stale: true,
  xhr: false,
  body: {},
  cookies: {},
  method: 'GET',
  params: {},
  query: {},
  route: {},
  signedCookies: {},
  originalUrl: '/',
  url: '/',
  baseUrl: '',
  res: {},
  next: jest.fn(),
} as any);

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'abc123'),
}));

describe('UrlsService', () => {
  let service: UrlsService;
  let urlRepository: jest.Mocked<Repository<UrlEntity>>;
  let configService: jest.Mocked<ConfigService>;

  const mockUrlEntity = {
    id: 1,
    shortCode: 'abc123',
    longUrl: 'https://example.com',
    clicks: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userId: null,
    user: null,
  } as unknown as UrlEntity;

  const mockCreateUrlDto: CreateUrlDto = {
    longUrl: 'https://example.com',
  };

  const mockUpdateUrlDto: UpdateUrlDto = {
    longUrl: 'https://newexample.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(UrlEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    urlRepository = module.get(getRepositoryToken(UrlEntity));
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUrl', () => {
    it('should create a URL successfully', async () => {
      const mockShortCode = 'abc123';
      const mockBaseUrl = 'http://localhost:3000';

      configService.get.mockImplementation((key: string) => {
        if (key === 'SHORT_CODE_LENGTH') return 6;
        if (key === 'BASE_URL') return mockBaseUrl;
        return false;
      });

      urlRepository.findOne.mockResolvedValue(null);
      urlRepository.create.mockReturnValue(mockUrlEntity);
      urlRepository.save.mockResolvedValue(mockUrlEntity);

      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const result = await service.createUrl(mockCreateUrlDto, mockReq);

      expect(result.shortUrl).toBe(`${mockBaseUrl}/redirect/${mockShortCode}`);
      expect(result.shortCode).toBe(mockShortCode);
      expect(result.longUrl).toBe(mockCreateUrlDto.longUrl);
      expect(result.owner).toBe(true);
      expect(result.clicks).toBe(0);
    });

    it('should create a URL anonymously when no user', async () => {
      const mockShortCode = 'abc123';
      const mockBaseUrl = 'http://localhost:3000';

      configService.get.mockImplementation((key: string) => {
        if (key === 'SHORT_CODE_LENGTH') return 6;
        if (key === 'BASE_URL') return mockBaseUrl;
        return false;
      });

      urlRepository.findOne.mockResolvedValue(null);
      urlRepository.create.mockReturnValue(mockUrlEntity);
      urlRepository.save.mockResolvedValue(mockUrlEntity);

      const mockReq = createMockRequest();
      const result = await service.createUrl(mockCreateUrlDto, mockReq);

      expect(result.owner).toBe(false);
    });

    it('should throw BadRequestException for invalid URL protocol', async () => {
      const invalidUrlDto = { longUrl: 'ftp://example.com' };
      const mockReq = createMockRequest();

      await expect(service.createUrl(invalidUrlDto, mockReq)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException for invalid URL format', async () => {
      const invalidUrlDto = { longUrl: 'not-a-url' };
      const mockReq = createMockRequest();

      await expect(service.createUrl(invalidUrlDto, mockReq)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should handle shortCode collision and retry', async () => {
      const mockShortCode = 'abc123';
      const mockBaseUrl = 'http://localhost:3000';

      configService.get.mockImplementation((key: string) => {
        if (key === 'SHORT_CODE_LENGTH') return 6;
        if (key === 'BASE_URL') return mockBaseUrl;
        return false;
      });

      urlRepository.findOne
        .mockResolvedValueOnce(mockUrlEntity)
        .mockResolvedValueOnce(null);

      urlRepository.create.mockReturnValue(mockUrlEntity);
      urlRepository.save.mockResolvedValue(mockUrlEntity);

      const mockReq = createMockRequest();
      const result = await service.createUrl(mockCreateUrlDto, mockReq);

      expect(result.shortCode).toBe(mockShortCode);
    });
  });

  describe('updateUrl', () => {
    it('should update URL successfully', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const existingUrl = { ...mockUrlEntity, userId: 1 };
      const updatedUrl = { ...existingUrl, longUrl: mockUpdateUrlDto.longUrl };

      urlRepository.findOne.mockResolvedValue(existingUrl);
      urlRepository.save.mockResolvedValue(updatedUrl);

      const result = await service.updateUrl(1, mockReq, mockUpdateUrlDto);

      expect(result.longUrl).toBe(mockUpdateUrlDto.longUrl);
    });

    it('should throw UnauthorizedException when user not authenticated', async () => {
      const mockReq = createMockRequest();

      await expect(service.updateUrl(1, mockReq, mockUpdateUrlDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw NotFoundException when URL not found', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });

      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUrl(1, mockReq, mockUpdateUrlDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException for invalid URL in update', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const existingUrl = { ...mockUrlEntity, userId: 1 };
      const invalidUpdateDto = { longUrl: 'ftp://example.com' };

      urlRepository.findOne.mockResolvedValue(existingUrl);

      await expect(service.updateUrl(1, mockReq, invalidUpdateDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should handle string ID and convert to number', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const existingUrl = { ...mockUrlEntity, userId: 1 };
      const updatedUrl = { ...existingUrl, longUrl: mockUpdateUrlDto.longUrl };

      urlRepository.findOne.mockResolvedValue(existingUrl);
      urlRepository.save.mockResolvedValue(updatedUrl);

      const result = await service.updateUrl('1', mockReq, mockUpdateUrlDto);

      expect(result.longUrl).toBe(mockUpdateUrlDto.longUrl);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });

      await expect(service.updateUrl('invalid-id', mockReq, mockUpdateUrlDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete URL successfully', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const existingUrl = { ...mockUrlEntity, userId: 1 };

      urlRepository.findOne.mockResolvedValue(existingUrl);
      urlRepository.softDelete.mockResolvedValue({ affected: 1 } as any);

      await expect(service.deleteUrl(1, mockReq)).resolves.not.toThrow();
      expect(urlRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when user not authenticated', async () => {
      const mockReq = createMockRequest();

      await expect(service.deleteUrl(1, mockReq)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw NotFoundException when URL not found', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });

      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUrl(1, mockReq)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('listUserUrls', () => {
    it('should list user URLs successfully', async () => {
      const mockReq = createMockRequest({ id: 1, email: 'test@example.com' });
      const userUrls = [mockUrlEntity];

      urlRepository.find.mockResolvedValue(userUrls);

      const result = await service.listUserUrls(mockReq);

      expect(result).toEqual(userUrls);
      expect(urlRepository.find).toHaveBeenCalledWith({
        where: { userId: 1, deletedAt: IsNull() },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw UnauthorizedException when user not authenticated', async () => {
      const mockReq = createMockRequest();

      await expect(service.listUserUrls(mockReq)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
