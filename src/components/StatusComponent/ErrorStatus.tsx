import React from "react";
import { StyleSheet, View } from "react-native";

import { AppImage } from "@/components/AppImage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { borderRadius, spacing, typography } from "@/constants/tokens";
import { Button } from "../Buttons/Button";

type Props = {
  title?: string;
  buttonTitle?: string;
  onRetry?: () => void;
  loading?: boolean;
};

export const ErrorStatus = ({
  title = "Не удалось загрузить данные",
  buttonTitle = "Повторить",
  onRetry,
}: Props) => {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.iconWrapper}>
        <AppImage
          source={require("@/assets/images/icons/illustration_sticker.png")}
          style={styles.icon}
        />
      </View>

      <ThemedText style={styles.title}>{title}</ThemedText>

      {onRetry ? <Button title={buttonTitle} onPress={onRetry} /> : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 112,
    height: 112,
  },
  title: {
    fontSize: typography.size.lg,
    lineHeight: 26,
    fontWeight: typography.weight.bold,
    textAlign: "center",
  },
});
