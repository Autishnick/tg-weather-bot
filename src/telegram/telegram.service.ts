// src/telegram/telegram.service.ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);
  private userChatIds: Set<number> = new Set(); // Сховище для всіх Chat ID

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.error('❌ TELEGRAM_BOT_TOKEN is not defined.');
      throw new Error('Telegram token missing');
    }
    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  async onModuleInit() {
    // 💡 ВИПРАВЛЕННЯ: Відкладаємо запуск Telegraf
    setTimeout(async () => {
      try {
        // Скидаємо старий Webhook (якщо був)
        await this.bot.telegram.deleteWebhook({ drop_pending_updates: true });

        // Запускаємо Long Polling
        await this.bot.launch();
        this.logger.warn('✅ Telegram bot started and listening for updates.');
      } catch (error) {
        this.logger.error(`❌ Telegraf launch failed: ${error.message}`);
      }
    }, 0); // Викликати одразу після завершення поточного циклу подій
  }

  async onModuleDestroy() {
    await this.bot.stop();
    this.logger.warn('🛑 Telegram bot stopped.');
  }

  private setupHandlers() {
    this.bot.start(async (ctx) => {
      const chatId = ctx.chat.id;
      this.userChatIds.add(chatId);
      this.logger.warn(`🔔 New user subscribed. Chat ID: ${chatId}`);

      await ctx.reply(
        `Прувет сексуалка! Я — бот погоди. Ваш Chat ID (${chatId}) збережено. Тепер я зможу надсилати вам щоденні прогнози(дік піки)!`,
      );
    });

    this.bot.command('stop', async (ctx) => {
      const chatId = ctx.chat.id;
      this.userChatIds.delete(chatId);
      this.logger.warn(`💔 User unsubscribed. Chat ID: ${chatId}`);
      await ctx.reply(`Ви відписалися від сповіщень про погоду(дік піків)`);
    });

    this.bot.on('text', (ctx) => {
      ctx.reply(
        'Я вмію лише надсилати погоду за розкладом. Напишіть /start, щоб підписатись на дік піки.',
      );
    });
  }

  async sendMessage(chatId: number, text: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send message to ${chatId}: ${error.message}`,
      );
    }
  }

  getAllChatIds(): number[] {
    return Array.from(this.userChatIds);
  }
}
