import { ConflictException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { IsNull, Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlEntity } from './entities/url.entity';

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);
  private readonly maxRetries = 5;
  private readonly shortCodeLength: number;

  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    private readonly configService: ConfigService
  ) {
    this.shortCodeLength = this.configService.get<number>('SHORT_CODE_LENGTH') || 6;
  }

  async createUrl(
    createUrlDto: CreateUrlDto,
    userId?: number
  ): Promise<{
    shortUrl: string;
    shortCode: string;
    longUrl: string;
    owner: boolean;
    createdAt: Date;
    clicks: number;
  }> {
    const { longUrl, customAlias } = createUrlDto;

    this.logger.log(`Iniciando criação de URL: ${longUrl}, userId: ${userId || 'anônimo'}`);

    try {
      this.validateUrlProtocol(longUrl);

      let shortCode: string;

      if (customAlias) {
        const allowCustomAlias = this.configService.get<boolean>('ALLOW_CUSTOM_ALIAS') || false;
        if (!allowCustomAlias) {
          throw new ConflictException('Alias personalizado não está habilitado');
        }

        const existingUrl = await this.urlRepository.findOne({
          where: { shortCode: customAlias },
        });

        if (existingUrl) {
          this.logger.warn(`Alias personalizado já existe: ${customAlias}`);
          throw new ConflictException('Alias personalizado já existe');
        }

        shortCode = customAlias;
      } else {
        shortCode = await this.generateUniqueShortCode();
      }

      const urlEntity = this.urlRepository.create({
        longUrl,
        shortCode,
        userId,
        clicks: 0,
      });

      const savedUrl = await this.urlRepository.save(urlEntity);

      const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
      const shortUrl = `${baseUrl}/${shortCode}`;

      this.logger.log(
        `URL criada com sucesso: ID=${savedUrl.id}, shortCode=${shortCode}, userId=${userId || 'anônimo'}`
      );

      return {
        shortUrl,
        shortCode,
        longUrl,
        owner: !!userId,
        createdAt: savedUrl.createdAt,
        clicks: savedUrl.clicks,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(`Erro ao criar URL: ${error.message}`, error.stack);
      throw new ServiceUnavailableException('Erro interno do servidor');
    }
  }

  private validateUrlProtocol(url: string): void {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Protocolo não permitido. Apenas HTTP e HTTPS são aceitos.');
      }
    } catch {
      throw new Error('URL inválida');
    }
  }

  private async generateUniqueShortCode(): Promise<string> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const shortCode = nanoid(this.shortCodeLength);

      try {
        const existingUrl = await this.urlRepository.findOne({
          where: { shortCode },
        });

        if (!existingUrl) {
          return shortCode;
        }

        this.logger.warn(`Colisão de shortCode detectada: ${shortCode}, tentativa ${attempt}`);
      } catch (error) {
        this.logger.error(`Erro ao verificar shortCode: ${error.message}`, error.stack);
      }
    }

    this.logger.error(`Falha ao gerar shortCode único após ${this.maxRetries} tentativas`);
    throw new ServiceUnavailableException('Erro ao gerar URL curta. Tente novamente.');
  }

  async redirectUrl(shortCode: string): Promise<{ longUrl: string; urlId: number }> {
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

      this.logger.log(`Redirecionamento realizado com sucesso: shortCode=${shortCode}, urlId=${url.id}`);

      return {
        longUrl: url.longUrl,
        urlId: url.id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Erro ao incrementar clicks para shortCode: ${shortCode}`, error.stack);
      throw new ServiceUnavailableException('Erro interno do servidor');
    }
  }
}
