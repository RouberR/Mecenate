import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

export type ButtonVariant = "primary" | "secondary";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = true,
}: Props) {
  const theme = useTheme();

  const bg = variant === "primary" ? theme.primary : theme.backgroundSelected;
  const textColor = variant === "primary" ? "#FFFFFF" : theme.textSecondary;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.pressable,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <ThemedText style={[styles.text, { color: textColor }]}>
            {title}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  container: {
    height: 42,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: typography.size.md,
    lineHeight: 26,
    fontWeight: typography.weight.semibold,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
});
