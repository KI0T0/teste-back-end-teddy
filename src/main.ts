import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const logger = new Logger('Bootstrap');
  
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API para encurtamento de URLs com autenticação opcional e contagem de cliques - Teste para Teddy Open Finance')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Aplicação executando em: http://localhost:${port}`);
  logger.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api`);
}
bootstrap();
