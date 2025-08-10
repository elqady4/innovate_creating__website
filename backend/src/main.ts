// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // تفعيل CORS
  app.enableCors();
  
  // تغيير المنفذ
  await app.listen(3001);
}
bootstrap();