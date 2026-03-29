import './load-env';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  /**
   * CORS: en desarrollo reflejamos cualquier Origin (Next en :3100, IP local, etc.).
   * En producción: CORS_ORIGINS o lista por defecto con variantes de localhost.
   * Métodos/cabeceras explícitos para que el preflight OPTIONS de POST JSON no falle.
   */
  const defaultFrontendOrigins = [
    'http://localhost:3100',
    'http://127.0.0.1:3100',
    'http://[::1]:3100',
  ];
  const isProd = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: isProd
      ? (process.env.CORS_ORIGINS ?? defaultFrontendOrigins.join(','))
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Lab Plantalia API')
    .setDescription('API del vivero Plantalia')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'admin-jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT ?? '', 10) || 3101;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
