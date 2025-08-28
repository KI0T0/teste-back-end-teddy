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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlsService } from './urls.service';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
  };
}

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma URL curta (autenticada)' })
  @ApiResponse({ status: 201, description: 'URL encurtada criada com sucesso' })
  @ApiResponse({ status: 400, description: 'URL inválida' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async createUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: RequestWithUser) {
    return await this.urlsService.createUrl(createUrlDto, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todas as URLs do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de URLs retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async listUserUrls(@Req() req: RequestWithUser) {
    return await this.urlsService.listUserUrls(req);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma URL existente' })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Usuário não tem permissão para editar esta URL' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async updateUrl(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto, @Req() req: RequestWithUser) {
    return await this.urlsService.updateUrl(id, req, updateUrlDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma URL existente' })
  @ApiResponse({ status: 204, description: 'URL removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Usuário não tem permissão para remover esta URL' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  @ApiResponse({ status: 503, description: 'Erro interno/serviço indisponível' })
  async deleteUrl(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.urlsService.deleteUrl(id, req);
  }
}
