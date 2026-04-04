import './load-env';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/** Next local típico: 3100 (PORT en .env) o 3000 (default de next dev). */
const DEV_FRONTEND_ORIGINS = [
  'http://localhost:3100',
  'http://127.0.0.1:3100',
  'http://[::1]:3100',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://[::1]:3000',
];

/**
 * Orígenes CORS: define CORS_ORIGINS en el host del API (coma). Ej.:
 * https://tu-app.vercel.app,https://www.tudominio.cl
 * En desarrollo sin variable: localhost del front en 3100 y 3000.
 */
function resolveCorsOrigin(): boolean | string | string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (raw) {
    const list = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return list.length === 1 ? list[0] : list;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'CORS_ORIGINS es obligatorio en producción. Define una lista separada por comas.',
    );
  }
  return DEV_FRONTEND_ORIGINS;
}

function applySecurityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.RATE_LIMIT_TRUST_PROXY?.trim() === 'true') {
    app.getHttpAdapter().getInstance().set('trust proxy', true);
  }
  app.use(applySecurityHeaders);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  /**
   * CORS: en desarrollo, orígenes en DEV_FRONTEND_ORIGINS (Next :3100 o :3000).
   * En producción: CORS_ORIGINS es obligatoria.
   * Métodos/cabeceras explícitos para que el preflight OPTIONS de POST JSON no falle.
   */
  app.enableCors({
    origin: resolveCorsOrigin(),
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
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
  const swaggerEnabled =
    process.env.SWAGGER_ENABLED?.trim() === 'true' ||
    process.env.NODE_ENV !== 'production';
  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = parseInt(process.env.PORT ?? '', 10) || 3101;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
