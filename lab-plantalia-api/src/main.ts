import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Orígenes CORS: define CORS_ORIGINS en el host del API (coma). Ej.:
 * https://tu-app.vercel.app,https://www.tudominio.cl
 * En desarrollo sin variable: solo localhost del front (3100).
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
    return true;
  }
  return [
    'http://localhost:3100',
    'http://127.0.0.1:3100',
    'http://[::1]:3100',
  ];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: resolveCorsOrigin(),
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  const port = parseInt(process.env.PORT ?? '', 10) || 3101;
  await app.listen(port);
}
bootstrap();
