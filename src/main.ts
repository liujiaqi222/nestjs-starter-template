import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(LoggerService));
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 删除dto没有定义的属性
    }),
  );

  await app.listen(3000);
}
bootstrap();
