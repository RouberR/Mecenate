import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { borderRadius, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type Props = TextInputProps & {
  label?: string;
  outlineBorderColor?: string;
  backgroundColor?: string;
};

export function TextInput({
  label,
  style,
  editable = true,
  outlineBorderColor,
  backgroundColor,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.label}
        >
          {label}
        </ThemedText>
      ) : null}

      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor ?? theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
          !editable && styles.disabled,
        ]}
      >
        <RNTextInput
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }, style]}
          editable={editable}
          {...rest}
        />
      </View>
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
    justifyContent: "center",
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
    color: "#ff3b30",
  },
});
