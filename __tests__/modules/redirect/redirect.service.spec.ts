import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UrlEntity } from '../../../src/modules/urls/entities/url.entity';
import { RedirectService } from '../../../src/modules/redirect/redirect.service';

describe('RedirectService', () => {
  let service: RedirectService;
  let urlRepository: jest.Mocked<Repository<UrlEntity>>;

  const mockUrl = {
    id: 1,
    shortCode: 'abc123',
    longUrl: 'https://example.com',
    clicks: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    userId: 1,
    user: null,
  } as unknown as UrlEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        {
          provide: getRepositoryToken(UrlEntity),
          useValue: {
            findOne: jest.fn(),
            increment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
    urlRepository = module.get(getRepositoryToken(UrlEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redirectUrl', () => {
    it('should redirect to URL successfully and increment clicks', async () => {
      const shortCode = 'abc123';
      urlRepository.findOne.mockResolvedValue(mockUrl);
      urlRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] } as UpdateResult);

      const result = await service.redirectUrl(shortCode);

      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode, deletedAt: IsNull() },
        select: ['id', 'longUrl'],
      });
      expect(urlRepository.increment).toHaveBeenCalledWith(
        { id: mockUrl.id },
        'clicks',
        1
      );
      expect(result).toEqual({
        url: mockUrl.longUrl,
        statusCode: 301,
      });
    });

    it('should throw NotFoundException when URL not found', async () => {
      const shortCode = 'nonexistent';
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.redirectUrl(shortCode)).rejects.toThrow(
        NotFoundException
      );
      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode, deletedAt: IsNull() },
        select: ['id', 'longUrl'],
      });
      expect(urlRepository.increment).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when URL is soft-deleted', async () => {
      const shortCode = 'deleted123';
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.redirectUrl(shortCode)).rejects.toThrow(
        NotFoundException
      );
      expect(urlRepository.findOne).toHaveBeenCalledWith({
        where: { shortCode, deletedAt: IsNull() },
        select: ['id', 'longUrl'],
      });
    });

    it('should handle increment failure gracefully', async () => {
      const shortCode = 'abc123';
      urlRepository.findOne.mockResolvedValue(mockUrl);
      urlRepository.increment.mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] } as UpdateResult);

      const result = await service.redirectUrl(shortCode);

      expect(result).toEqual({
        url: mockUrl.longUrl,
        statusCode: 301,
      });
      expect(urlRepository.increment).toHaveBeenCalledWith(
        { id: mockUrl.id },
        'clicks',
        1
      );
    });



    it('should work with different shortCode formats', async () => {
      const shortCodes = ['abc123', '123abc', 'abc-123', 'abc_123'];
      
      for (const shortCode of shortCodes) {
        urlRepository.findOne.mockResolvedValue(mockUrl);
        urlRepository.increment.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] } as UpdateResult);

        const result = await service.redirectUrl(shortCode);

        expect(result).toEqual({
          url: mockUrl.longUrl,
          statusCode: 301,
        });
        expect(urlRepository.findOne).toHaveBeenCalledWith({
          where: { shortCode, deletedAt: IsNull() },
          select: ['id', 'longUrl'],
        });
      }
    });

    it('should handle empty shortCode', async () => {
      const shortCode = '';
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.redirectUrl(shortCode)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle very long shortCode', async () => {
      const shortCode = 'a'.repeat(100);
      urlRepository.findOne.mockResolvedValue(null);

      await expect(service.redirectUrl(shortCode)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
