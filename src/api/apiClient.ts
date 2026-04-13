import axios from 'axios';

import { sessionStore } from '@/store/session-store';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://k8s.mectest.ru/test-app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStore.authToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

