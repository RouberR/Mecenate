/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";
import { layout } from "./tokens";

export const Colors = {
  light: {
    text: "#111416",
    background: "#F5F8FD",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#EFF2F7",
    textSecondary: "#57626F",
    primary: "#6115CD",
    likeActive: "#FF2B75",
    likeActiveText: "#FFEAF1",
    skeleton: "rgba(238,239,241,0.8)",
    chatMessage: "#D5C9FF",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#161719",
    backgroundSelected: "#212225",
    textSecondary: "#B0B4BA",
    primary: "#8C5BFF",
    likeActive: "#FF2B75",
    likeActiveText: "#FFEAF1",
    skeleton: "rgba(238,239,241,0.12)",
    chatMessage: "#D5C9FF",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = layout.maxContentWidth;
