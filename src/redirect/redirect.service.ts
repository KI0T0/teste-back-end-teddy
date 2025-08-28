import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UrlEntity } from '../urls/entities/url.entity';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>
  ) {}

  async redirectUrl(shortCode: string): Promise<{ url: string; statusCode: number }> {
    const url = await this.urlRepository.findOne({
      where: { shortCode, deletedAt: IsNull() },
      select: ['id', 'longUrl'],
    });

    if (!url) {
      this.logger.warn({ event: 'redirect:not_found', shortCode });
      throw new NotFoundException('URL não encontrada');
    }

    await this.urlRepository.increment({ id: url.id }, 'clicks', 1);

    this.logger.log({ event: 'redirect:hit', shortCode, urlId: url.id });

    return {
      url: url.longUrl,
      statusCode: 301,
    };
  }
}
