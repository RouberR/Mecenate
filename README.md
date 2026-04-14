# Mecenate — тестовое задание

Источник данных: Swagger `https://k8s.mectest.ru/test-app/openapi.json`
WS-документация: `https://k8s.mectest.ru/test-app/docs`

## Запуск (Expo Go)

Последняя версия Expo Go 55 sdk - https://expo.dev/go

![alt text](image.png)

https://expo.dev/preview/update?message=update+fix&updateRuntimeVersion=1.0.0&createdAt=2026-04-14T16%3A50%3A37.861Z&slug=exp&projectId=6a4d0115-89de-4808-b96f-51e5f77266fa&group=798b57fd-c0f8-4541-84be-a497117b56e4

Установить зависимости:

```bash
npm install
```

Запустить:

```bash
npx expo start

```

Далее отсканировать QR в **Expo Go** (iOS/Android).

Последняя версия - https://expo.dev/go

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
