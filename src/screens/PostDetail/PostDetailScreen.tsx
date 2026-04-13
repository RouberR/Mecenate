import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Buttons/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, layout, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

export function PostDetailScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.iconWrap}>
            <SymbolView
              tintColor={theme.primary}
              name={{
                ios: "exclamationmark.triangle.fill",
                android: "error",
                web: "error",
              }}
              size={56}
            />
          </View>
          <ThemedText style={styles.title}>
            Не удалось открыть публикацию
          </ThemedText>
          <Button
            title="На главную"
            onPress={() => router.replace({ pathname: "/" } as any)}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
    maxWidth: layout.maxContentWidth,
  },
  card: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 16,
    alignItems: "center",
  },
  iconWrap: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: typography.size.lg,
    lineHeight: 26,
    fontWeight: typography.weight.bold,
    textAlign: "center",
  },
});
