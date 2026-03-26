import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3100',
  });
  const port = parseInt(process.env.PORT ?? '', 10) || 3101;
  await app.listen(port);
}
bootstrap();
