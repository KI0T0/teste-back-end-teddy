import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
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
    this.logger.log(`Tentativa de redirecionamento para shortCode: ${shortCode}`);

    try {
      const url = await this.urlRepository.findOne({
        where: { shortCode, deletedAt: IsNull() },
        select: ['id', 'longUrl'],
      });

      if (!url) {
        this.logger.warn(`ShortCode não encontrado: ${shortCode}`);
        throw new NotFoundException('URL não encontrada');
      }

      await this.urlRepository.increment({ id: url.id }, 'clicks', 1);

      this.logger.log(`Redirecionamento realizado com sucesso - shortCode: ${shortCode}, urlId: ${url.id}`);

      return {
        url: url.longUrl,
        statusCode: 301,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Erro ao incrementar clicks para shortCode: ${shortCode} - ${error.message}`, error.stack);
      throw new ServiceUnavailableException('Erro interno do servidor');
    }
  }
}
