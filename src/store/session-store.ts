import { makeAutoObservable } from "mobx";

const DEFAULT_AUTH_TOKEN = "550e8400-e29b-41d4-a716-446655440000";

export class SessionStore {
  authToken: string = process.env.EXPO_PUBLIC_AUTH_TOKEN ?? DEFAULT_AUTH_TOKEN;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }
}

export const sessionStore = new SessionStore();
