import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { AppPressable } from "../AppPressable";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function ButtonLink({ title, onPress, disabled = false }: Props) {
  const theme = useTheme();

  return (
    <AppPressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => pressed && !disabled && styles.pressed}
    >
      <ThemedText style={[styles.text, { color: theme.primary }]}>
        {title}
      </ThemedText>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
  },
  pressed: {
    opacity: 0.7,
  },
});
