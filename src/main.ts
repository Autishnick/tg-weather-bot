import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log('🚀 Application started on port:', port);
  console.log('⏰ Cron jobs should be active now');
  console.log('📅 Current time:', new Date().toLocaleString());
}
bootstrap();
