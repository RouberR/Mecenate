import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { typography } from '@/constants/tokens';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function ButtonLink({ title, onPress, disabled = false }: Props) {
  const theme = useTheme();

  return (
    <Pressable onPress={disabled ? undefined : onPress} style={({ pressed }) => pressed && !disabled && styles.pressed}>
      <ThemedText style={[styles.text, { color: theme.primary }]}>{title}</ThemedText>
    </Pressable>
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

