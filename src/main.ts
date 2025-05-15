import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS
  app.enableCors();
  
  // Configurer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configurer le dossier d'uploads statiques
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  // Configurer Swagger
  const config = new DocumentBuilder()
    .setTitle('AutoLink CI API')
    .setDescription('API pour la plateforme de vente de véhicules AutoLink CI')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
