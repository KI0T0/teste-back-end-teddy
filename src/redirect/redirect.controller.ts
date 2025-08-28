import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  @Redirect()
  async redirectToUrl(@Param('shortCode') shortCode: string) {
    return await this.redirectService.redirectUrl(shortCode);
  }
}
