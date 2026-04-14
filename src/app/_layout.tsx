import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import { queryClient } from "@/api/queryClient";
import { RealtimeBridge } from "@/api/socket/RealtimeBridge";
import { AnimatedSplashOverlay } from "@/components/AnimatedIcon/AnimatedIcon";
import { KeyboardProvider } from "react-native-keyboard-controller";
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AnimatedSplashOverlay />
          <RealtimeBridge />
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
