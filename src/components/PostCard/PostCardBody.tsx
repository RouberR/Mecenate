import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { Post } from "@/api/types";
import { ThemedText } from "@/components/ThemedText";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { CardType } from "./PostCard";
import { AppPressable } from "../AppPressable";

type Props = {
  variant: "feed";
  post: Post;
  isPaid: boolean;
  type: CardType;
};

export function PostCardBody({ post, isPaid, type }: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (isPaid) {
    return (
      <View style={styles.paidSkeletonWrap}>
        <View
          style={[styles.skeletonTitle, { backgroundColor: theme.skeleton }]}
        />
        <View
          style={[styles.skeletonText, { backgroundColor: theme.skeleton }]}
        />
      </View>
    );
  }
  const showMore =
    !expanded && type === "preview" && post.body !== post.preview;
  const text = expanded || type === "details" ? post.body : post.preview;

  return (
    <>
      <ThemedText style={styles.title} numberOfLines={1}>
        {post.title}
      </ThemedText>

      <View style={styles.previewWrap}>
        <ThemedText style={[styles.preview, { color: theme.text }]}>
          {text}
        </ThemedText>

        {showMore && !expanded && (
          <>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0.9)",
                theme.backgroundElement,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              style={styles.fade}
            />

            <AppPressable
              style={[
                styles.moreButton,
                { backgroundColor: theme.backgroundElement },
              ]}
              onPress={() => setExpanded(true)}
            >
              <ThemedText style={[styles.moreText, { color: theme.primary }]}>
                Показать еще
              </ThemedText>
            </AppPressable>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  paidSkeletonWrap: {
    gap: 8,
    paddingTop: 8,
  },

  skeletonTitle: {
    height: 26,
    width: 164,
    borderRadius: 22,
  },

  skeletonText: {
    height: 40,
    alignSelf: "stretch",
    borderRadius: 22,
  },

  title: {
    fontSize: typography.size.lg,
    lineHeight: 26,
    fontWeight: typography.weight.bold,
  },

  previewWrap: {
    position: "relative",
  },

  preview: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
  },

  fade: {
    position: "absolute",
    right: 80,
    bottom: 0,
    width: 80,
    height: 24,
  },

  moreButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },

  moreText: {
    fontWeight: typography.weight.medium,
    fontSize: typography.size.md,
    lineHeight: 20,
  },

  body: {
    fontSize: typography.size.md,
    lineHeight: 22,
    fontWeight: typography.weight.medium,
  },

  postTitle: {
    fontSize: typography.size.h2,
    lineHeight: 30,
    fontWeight: typography.weight.bold,
  },

  paidNotice: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    alignItems: "center",
    gap: 10,
  },

  paidNoticeText: {
    textAlign: "center",
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.semibold,
  },
});
