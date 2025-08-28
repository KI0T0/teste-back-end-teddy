import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RedirectService } from './redirect.service';

@ApiTags('redirect')
@Controller('redirect')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  @Redirect()
  @ApiOperation({ summary: 'Redireciona para a URL original' })
  @ApiResponse({ status: 301, description: 'Redirecionamento realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Código curto não encontrado' })
  async redirectToUrl(@Param('shortCode') shortCode: string) {
    return await this.redirectService.redirectUrl(shortCode);
  }
}
