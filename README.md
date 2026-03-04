# MOM3

Сайт с автоматическими расчётами, таблицами и графиками по `book.pdf`.

## Локальный запуск

Требуется `Node.js >= 20.19.0`.

```bash
npm ci
npm run dev
```

## Проверка

```bash
npm run validate
npm run build
```

## Deploy на Vercel

Проект подготовлен под Vercel как `Vite`-приложение.

- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Переменные окружения: не нужны

После импорта репозитория в Vercel дополнительных настроек не требуется.
