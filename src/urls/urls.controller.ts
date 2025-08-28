import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Request } from '@nestjs/common';
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
}
