import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Redirect, Request } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';

interface RequestWithUser extends Request {
  user?: {
    sub: number;
    email: string;
  };
}

@Controller('urls')
export class UrlsController {
  private readonly logger = new Logger(UrlsController.name);

  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUrl(@Body() createUrlDto: CreateUrlDto, @Request() req: RequestWithUser) {
    this.logger.log(`Tentativa de criação de URL: ${createUrlDto.longUrl}`);

    try {
      let userId: number | undefined;

      if (req.user?.sub) {
        userId = req.user.sub;
        this.logger.log(`Usuário autenticado detectado: ${userId}`);
      }

      const result = await this.urlsService.createUrl(createUrlDto, userId);

      this.logger.log(`URL criada com sucesso: ${result.shortCode}`);
      return result;
    } catch (error) {
      this.logger.error(`Falha ao criar URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':shortCode')
  @Redirect()
  async redirectToUrl(@Param('shortCode') shortCode: string) {
    this.logger.log(`Tentativa de redirecionamento para: ${shortCode}`);

    try {
      const { longUrl } = await this.urlsService.redirectUrl(shortCode);

      this.logger.log(`Redirecionando para: ${longUrl}`);

      return {
        url: longUrl,
        statusCode: 301,
      };
    } catch (error) {
      this.logger.error(`Falha no redirecionamento para: ${shortCode}`, error.stack);
      throw error;
    }
  }
}
