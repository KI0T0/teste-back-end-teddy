import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { nanoid } from 'nanoid';
import { IsNull, Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlEntity } from './entities/url.entity';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
  };
}

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
    req: RequestWithUser
  ): Promise<{
    shortUrl: string;
    shortCode: string;
    longUrl: string;
    owner: boolean;
    createdAt: Date;
    clicks: number;
  }> {
    const { longUrl } = createUrlDto;
    const userId = req.user?.id;

    this.logger.log({ event: 'create_url:start', longUrl, userId });

    this.validateUrlProtocol(longUrl);

    const shortCode = await this.generateUniqueShortCode();

    const urlEntity = this.urlRepository.create({
      longUrl,
      shortCode,
      userId,
      clicks: 0,
    });

    const savedUrl = await this.urlRepository.save(urlEntity);

    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    this.logger.log({ event: 'create_url:success', urlId: savedUrl.id, shortCode, userId });

    return {
      shortUrl,
      shortCode,
      longUrl,
      owner: !!userId,
      createdAt: savedUrl.createdAt,
      clicks: savedUrl.clicks,
    };
  }

  private validateUrlProtocol(url: string): void {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new BadRequestException('Protocolo não permitido. Apenas HTTP e HTTPS são aceitos.');
      }
    } catch {
      throw new BadRequestException('URL inválida');
    }
  }

  

  private async generateUniqueShortCode(): Promise<string> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const shortCode = nanoid(this.shortCodeLength);

      const existingUrl = await this.urlRepository.findOne({
        where: { shortCode },
      });

      if (!existingUrl) {
        return shortCode;
      }

      this.logger.warn({ event: 'create_url:collision', shortCode, attempt });
    }

    this.logger.error(
      `Falha ao gerar shortCode único após ${this.maxRetries} tentativas (tamanho: ${this.shortCodeLength})`
    );
    throw new BadRequestException('Erro ao gerar URL curta. Tente novamente.');
  }

  async updateUrl(id: string | number, req: RequestWithUser, updateUrlDto: UpdateUrlDto): Promise<UrlEntity> {
    const urlId = this.validateAndParseId(id);
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const url = await this.urlRepository.findOne({
      where: { id: urlId, userId, deletedAt: IsNull() },
    });

    if (!url) {
      this.logger.warn({ event: 'update_url:forbidden', urlId, userId });
      throw new NotFoundException('URL não encontrada');
    }

    this.validateUrlProtocol(updateUrlDto.longUrl);

    Object.assign(url, updateUrlDto);
    const updatedUrl = await this.urlRepository.save(url);

    this.logger.log({ event: 'update_url:success', urlId, userId });

    return updatedUrl;
  }

  async deleteUrl(id: string | number, req: RequestWithUser): Promise<void> {
    const urlId = this.validateAndParseId(id);
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const url = await this.urlRepository.findOne({
      where: { id: urlId, userId, deletedAt: IsNull() },
    });

    if (!url) {
      this.logger.warn({ event: 'delete_url:forbidden', urlId, userId });
      throw new NotFoundException('URL não encontrada');
    }

    await this.urlRepository.softDelete(urlId);

    this.logger.log({ event: 'delete_url:success', urlId, userId });
  }

  async listUserUrls(req: RequestWithUser): Promise<UrlEntity[]> {
    const userId = req.user?.id;
    console.log('listUserUrls - req.user:', req.user);
    console.log('listUserUrls - userId:', userId);

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const urls = await this.urlRepository.find({
      where: { userId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    console.log('listUserUrls - URLs encontradas:', urls);
    console.log('listUserUrls - Query executada:', { userId, deletedAt: 'IS NULL' });

    return urls;
  }

  private validateAndParseId(id: string | number): number {
    const urlId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (Number.isNaN(urlId)) {
      throw new BadRequestException('ID inválido');
    }
    return urlId;
  }
}
