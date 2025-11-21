import { HttpModule } from '@nestjs/axios'; // <-- Імпортуємо HttpModule
import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule], // <-- Додаємо до імпортів
  providers: [WeatherService],
  exports: [WeatherService], // <-- Експортуємо сервіс!
})
export class WeatherModule {}
