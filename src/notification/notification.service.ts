// src/notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TelegramService } from '../telegram/telegram.service';
import { WeatherService } from '../weather/weather.service'; // Переконайтеся, що шлях правильний

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly targetCity = 'Lviv'; // Фіксоване місто для тесту

  constructor(
    private readonly weatherService: WeatherService,
    private readonly telegramService: TelegramService,
  ) {
    this.logger.warn('🚀 NotificationService initialized');
  }

  @Cron('0 6 * * *')
  async handleDailyWeatherNotification() {
    this.logger.warn('🕐 Cron triggered at: ' + new Date().toLocaleString());

    try {
      // 1. Отримати прогноз
      const weatherInfo = await this.weatherService.getTomorrowForecast(
        this.targetCity,
      );

      const allUsers = this.telegramService.getAllChatIds();

      if (allUsers.length === 0) {
        this.logger.warn('No users subscribed. Skipping message delivery.');
        return;
      }

      const message = `ВИ ЗАБУЛИ ДІЛДО НА КАСІ, СКИНУТИ ДІК ПІК ТА ПОСМІХНУТИСЯ)
      🌤️ **Прогноз погоди на завтра у ${this.targetCity}**:\n${weatherInfo}`;

      for (const chatId of allUsers) {
        await this.telegramService.sendMessage(chatId, message);
        this.logger.log(`✅ Message sent to ${chatId}`);
      }

      this.logger.log(
        `✅ Cron job completed. Messages sent to ${allUsers.length} users.`,
      );
    } catch (error) {
      this.logger.error(`❌ Cron job failed: ${error.message}`);
    }
  }
}
