import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';

interface RequestWithUser extends Request {
  user?: {
    sub: number;
    email: string;
  };
}

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: RequestWithUser) {
    return await this.urlsService.createUrl(createUrlDto, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listUserUrls(@Req() req: RequestWithUser) {
    return await this.urlsService.listUserUrls(req);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUrl(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto, @Req() req: RequestWithUser) {
    return await this.urlsService.updateUrl(id, req, updateUrlDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.urlsService.deleteUrl(id, req);
  }
}
