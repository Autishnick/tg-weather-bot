// src/weather/weather.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

// --- ІНТЕРФЕЙСИ ДЛЯ ТИПІЗАЦІЇ ---
interface MainData {
  temp: number;
  feels_like: number;
}

interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface ForecastItem {
  dt: number;
  main: MainData;
  weather: WeatherData[];
  dt_txt: string;
}

// ⚠️ ФІКСОВАНІ ЗНАЧЕННЯ ДЛЯ ТЕСТУВАННЯ
const OPENWEATHER_API_KEY = '41754442dfc0d59db4bd2c415ee8a682';
const OPENWEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  // Вводимо HttpService через конструктор
  constructor(private readonly httpService: HttpService) {}

  /**
   * Отримує прогноз погоди на завтра для вказаного міста.
   */
  async getTomorrowForecast(city: string): Promise<string> {
    const url = `${OPENWEATHER_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=uk`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      // --- ЛОГІКА ПОШУКУ ПРОГНОЗУ НА ЗАВТРА ---
      const today = new Date();

      // Встановлюємо початок завтрашнього дня (00:00:00)
      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(today.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0);

      // Встановлюємо початок післязавтра
      const dayAfterTomorrowStart = new Date(tomorrowStart);
      dayAfterTomorrowStart.setDate(tomorrowStart.getDate() + 1);

      let tomorrowNoonForecast: ForecastItem | null = null;

      // Ітеруємо по прогнозах, шукаючи відповідний час
      for (const forecast of data.list as ForecastItem[]) {
        const forecastTimestamp = forecast.dt * 1000;
        const forecastDate = new Date(forecastTimestamp);

        // 1. Перевіряємо, чи прогноз належить завтрашньому дню
        if (
          forecastTimestamp >= tomorrowStart.getTime() &&
          forecastTimestamp < dayAfterTomorrowStart.getTime()
        ) {
          // 2. Вибираємо прогноз, що найближче до полудня (12:00, 15:00)
          if (forecastDate.getHours() >= 12 && forecastDate.getHours() <= 15) {
            tomorrowNoonForecast = forecast;
            break;
          }
        }
      }

      // --- ФОРМАТУВАННЯ РЕЗУЛЬТАТУ ---
      if (tomorrowNoonForecast) {
        const temp = Math.round(tomorrowNoonForecast.main.temp);
        const description = tomorrowNoonForecast.weather[0].description;

        return (
          `📍 Прогноз для **${city}** на завтра:\n` +
          `🌡️ Температура: **${temp}°C**\n` +
          `☁️ Умови: ${description.charAt(0).toUpperCase() + description.slice(1)}`
        );
      } else {
        // Повертаємо помилку, якщо не знайдено прогнозу на завтра
        return `Помилка: Не вдалося знайти точний прогноз на завтра для ${city}.`;
      }
    } catch (error) {
      // Обробка помилок запиту
      if (error.response) {
        this.logger.error(
          `API Error for ${city}: ${error.response.data.message}`,
        );
        return `Помилка API: ${error.response.data.message}`;
      } else {
        this.logger.error(
          `General Error fetching weather for ${city}:`,
          error.message,
        );
        return `Загальна помилка: Не вдалося отримати дані про погоду для ${city}.`;
      }
    }
  }
}
