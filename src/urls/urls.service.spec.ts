import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlEntity } from './entities/url.entity';
import { UrlsService } from './urls.service';

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

      const result = await service.createUrl(mockCreateUrlDto);

      expect(result.shortUrl).toBe(`${mockBaseUrl}/${mockShortCode}`);
      expect(result.shortCode).toBe(mockShortCode);
      expect(result.longUrl).toBe(mockCreateUrlDto.longUrl);
      expect(result.owner).toBe(false);
      expect(result.clicks).toBe(0);
    });
  });
});
