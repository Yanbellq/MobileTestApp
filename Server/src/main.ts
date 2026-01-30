import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // видаляє поля, яких немає в DTO
      forbidNonWhitelisted: true, // видає помилку, якщо є зайві поля
      transform: true, // автоматично перетворює типи (наприклад, рядок у число)
    }),
  );

  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT!);
}
bootstrap();
