import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { API_BASE_URL } from "@/api/apiClient";
import { sessionStore } from "@/store/session-store";

function toWsUrl(baseUrl: string, token: string) {
  const trimmed = baseUrl.replace(/\/+$/, "");
  const wsBase = trimmed.replace(/^http/i, "ws");
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`;
}

type Options = {
  enabled?: boolean;
  onEvent: (event: unknown) => void;
};

export function useRealtimeEvents({ enabled = true, onEvent }: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const mountedRef = useRef(true);
  const enabledRef = useRef(enabled);
  const appPausedRef = useRef(false);

  enabledRef.current = enabled;

  const clearReconnect = () => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
  };

  const stop = (opts?: { fromAppState?: boolean }) => {
    clearReconnect();
    if (opts?.fromAppState) appPausedRef.current = true;
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {
        console.log("Error wsRef.current.close", e);
      }
      wsRef.current = null;
    }
    reconnectAttemptRef.current = 0;
  };

  const scheduleReconnect = () => {
    clearReconnect();
    const attempt = Math.min(reconnectAttemptRef.current + 1, 6);
    reconnectAttemptRef.current = attempt;
    const baseDelayMs = Math.min(30000, 1000 * 2 ** attempt);
    const jitter = Math.floor(Math.random() * 250);
    reconnectTimerRef.current = setTimeout(
      () => connect(),
      baseDelayMs + jitter,
    );
  };

  const connect = () => {
    if (!mountedRef.current) return;
    if (!enabledRef.current) return;
    if (appPausedRef.current) return;

    const token = sessionStore.authToken;
    if (!token) return;
    const url = toWsUrl(API_BASE_URL, token);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(String(msg.data));
        onEventRef.current(parsed);
      } catch {}
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      wsRef.current = null;
      if (!mountedRef.current) return;
      if (!enabledRef.current) return;
      if (appPausedRef.current) return;
      scheduleReconnect();
    };
  };

  useEffect(() => {
    enabledRef.current = enabled;

    if (!enabled) {
      stop();
      return;
    }

    mountedRef.current = true;
    appPausedRef.current = false;

    const handleAppState = (next: AppStateStatus) => {
      if (next === "active") {
        appPausedRef.current = false;
        if (!wsRef.current) connect();
      } else {
        stop({ fromAppState: true });
      }
    };

    const sub = AppState.addEventListener("change", handleAppState);

    if (AppState.currentState === "active") connect();

    return () => {
      mountedRef.current = false;
      sub.remove();
      stop();
    };
  }, [enabled]);
}
