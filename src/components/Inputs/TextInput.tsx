import React, { useMemo } from 'react';
import { StyleSheet, TextInput as RNTextInput, type TextInputProps, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { borderRadius, typography } from '@/constants/tokens';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextInput({ label, error, style, editable = true, ...rest }: Props) {
  const theme = useTheme();
  const hasError = Boolean(error);

  const containerStyle = useMemo(
    () => [
      styles.container,
      { backgroundColor: theme.backgroundElement, borderColor: hasError ? '#ff3b30' : 'transparent' },
      !editable && styles.disabled,
    ],
    [editable, hasError, theme.backgroundElement]
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}

      <View style={containerStyle}>
        <RNTextInput
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }, style]}
          editable={editable}
          {...rest}
        />
      </View>

      {error ? (
        <ThemedText type="small" style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    marginLeft: 4,
  },
  container: {
    minHeight: 40,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
  },
  input: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#ff3b30',
  },
});

