import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { Post } from "@/api/types";
import { AppImage } from "@/components/AppImage";
import { Icon } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { AppPressable } from "../AppPressable";

type Props = {
  post: Post;
  isPaid: boolean;
};

export function PostCardMedia({ post, isPaid }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.mediaBlock}>
      <AppImage
        source={{ uri: post.coverUrl }}
        style={styles.cover}
        contentFit="cover"
        blurred={isPaid}
      />

      {isPaid ? (
        <View style={styles.paidOverlay}>
          <View
            style={[styles.paidIconWrap, { backgroundColor: theme.primary }]}
          >
            <Icon name="donate-solid" size={30} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.paidText}>
            Контент скрыт пользователем.{"\n"}Доступ откроется после доната
          </ThemedText>
          <AppPressable
            onPress={
              () => {}
              // router.push({ pathname: "/posts/[id]", params: { id: post.id } })
            }
            style={({ pressed }) => pressed && styles.pressed}
          >
            <View
              style={[styles.paidButton, { backgroundColor: theme.primary }]}
            >
              <ThemedText style={styles.paidButtonText}>
                Отправить донат
              </ThemedText>
            </View>
          </AppPressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mediaBlock: {
    gap: 8,
  },
  cover: {
    alignSelf: "stretch",
    marginHorizontal: -spacing.md,
    aspectRatio: 1,
    // borderRadius: 0,
    // backgroundColor: "#00000010",
  },
  paidOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.50)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    gap: 8,
    marginHorizontal: -spacing.md,
  },
  paidIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  paidText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.semibold,
  },
  paidButton: {
    height: 42,
    paddingHorizontal: 32,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 239,
  },
  paidButtonText: {
    color: "#FFFFFF",
    fontSize: typography.size.md,
    lineHeight: 26,
    fontWeight: typography.weight.semibold,
  },
  pressed: {
    opacity: 0.7,
  },
});
