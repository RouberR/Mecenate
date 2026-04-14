# Mecenate — тестовое задание

Источник данных: Swagger `https://k8s.mectest.ru/test-app/openapi.json`
WS-документация: `https://k8s.mectest.ru/test-app/docs`

## Запуск (Expo Go)

Установить зависимости:

```bash
npm install
```

Запустить:

```bash
npx expo start

```

Далее отсканировать QR в **Expo Go** (iOS/Android).

## Переменные окружения

Используются `EXPO_PUBLIC_*` переменные (подхватываются Expo автоматически).

- **EXPO_PUBLIC_API_BASE_URL**: базовый URL API (по умолчанию `https://k8s.mectest.ru/test-app`)
- **EXPO_PUBLIC_AUTH_TOKEN**: Bearer UUID токен пользователя

Пример (macOS / zsh):

```bash
export EXPO_PUBLIC_API_BASE_URL="https://k8s.mectest.ru/test-app"
export EXPO_PUBLIC_AUTH_TOKEN="550e8400-e29b-41d4-a716-446655440000"
npx expo start
```
