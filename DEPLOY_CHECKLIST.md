# ✅ Checklist для деплоя на Render

## Перед деплоєм

- [ ] Отримав Telegram Bot Token від @BotFather
- [ ] Отримав Weather API Key (openweathermap.org)
- [ ] Запушив код на GitHub
- [ ] Проект збирається без помилок (`npm run build`)

## Деплой на Render

1. [ ] Зайти на https://render.com
2. [ ] "New +" → "Web Service"
3. [ ] Підключити GitHub репозиторій
4. [ ] Додати Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `WEATHER_API_KEY`
   - `NODE_ENV=production`
5. [ ] "Create Web Service"
6. [ ] Скопіювати URL (типу: `https://ваш-бот.onrender.com`)

## Налаштування Keep-Alive (UptimeRobot)

1. [ ] Зайти на https://uptimerobot.com
2. [ ] "+ Add New Monitor"
3. [ ] Налаштувати:
   - Type: HTTP(s)
   - URL: `https://ваш-бот.onrender.com/health`
   - Interval: 5 або 10 хвилин
4. [ ] "Create Monitor"

## Перевірка

```bash
# Перевірити health endpoint
curl https://ваш-бот.onrender.com/health

# Має повернути: {"status":"ok","timestamp":"...","uptime":...}
```

✅ **Готово!** Бот працює 24/7

