// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module'; // <-- Імпортуємо TelegramModule
import { WeatherModule } from '../weather/weather.module'; // <-- Імпортуємо WeatherModule
import { NotificationService } from './notification.service';

@Module({
  imports: [WeatherModule, TelegramModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
