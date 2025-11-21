# Деплоймент на Render з keep-alive

## 1. Деплоймент на Render

1. Зайдіть на https://render.com і зареєструйтесь
2. Натисніть "New +" → "Web Service"
3. Підключіть GitHub репозиторій
4. Render автоматично знайде `render.yaml` і використає його конфігурацію
5. Додайте Environment Variables:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен
   WEATHER_API_KEY=ваш_ключ
   NODE_ENV=production
   ```
6. Натисніть "Create Web Service"
7. Скопіюйте URL вашого сервісу (буде виглядати як: `https://telegram-weather-bot-xxxx.onrender.com`)

## 2. Налаштування UptimeRobot (keep-alive)

### Варіант A: UptimeRobot (Рекомендовано)

1. Зайдіть на https://uptimerobot.com і зареєструйтесь (безкоштовно)
2. Натисніть "+ Add New Monitor"
3. Заповніть:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Telegram Weather Bot
   - **URL:** `https://ваш-сервіс.onrender.com/health`
   - **Monitoring Interval:** 5 Minutes (або 10 Minutes)
4. Натисніть "Create Monitor"

✅ Готово! UptimeRobot буде пінгувати ваш бот кожні 5-10 хвилин, і він не заснe.

### Варіант B: Cron-job.org

1. Зайдіть на https://cron-job.org і зареєструйтесь
2. Натисніть "Create cronjob"
3. Заповніть:
   - **Title:** Keep Bot Alive
   - **URL:** `https://ваш-сервіс.onrender.com/ping`
   - **Schedule:** Every 10 minutes
4. Натисніть "Create"

### Варіант C: Koyeb (альтернатива Render)

Якщо UptimeRobot не підходить, можна використати Koyeb, який має безкоштовний план без засинання.

## 3. Перевірка

Після деплоя перевірте ці URL:

```bash
# Health check
curl https://ваш-сервіс.onrender.com/health

# Ping
curl https://ваш-сервіс.onrender.com/ping
```

Обидва мають повернути `{"status":"ok"}`

## 4. Моніторинг

- Логи на Render: Dashboard → Logs
- Status на UptimeRobot: Dashboard (показує uptime %)

