import * as Haptics from "expo-haptics";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

import type { Comment } from "@/api/types";
import { AppImage } from "@/components/AppImage";
import { AppPressable } from "@/components/AppPressable";
import { LikeAction } from "@/components/Buttons/LikeAction";
import { ThemedText } from "@/components/ThemedText";
import { spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  comment: Comment;
  likeState?: { count: number; isLiked: boolean };
  onToggleLike: () => void;
};

function CommentRowInner({ comment, likeState, onToggleLike }: Props) {
  const theme = useTheme();

  const isLiked = Boolean(likeState?.isLiked);
  const count = likeState?.count ?? 0;

  return (
    <View style={styles.row}>
      <AppImage
        source={{ uri: comment.author.avatarUrl }}
        style={styles.avatar}
      />

      <View style={styles.textBlock}>
        <ThemedText style={[styles.authorName, { color: theme.text }]}>
          {comment.author.displayName}
        </ThemedText>

        <ThemedText style={[styles.bodyText, { color: theme.text }]}>
          {comment.text}
        </ThemedText>
      </View>

      <AppPressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => undefined,
          );

          onToggleLike();
        }}
        hitSlop={10}
        style={({ pressed }) => [styles.likeHit, pressed && styles.pressed]}
      >
        <LikeAction count={count} active={isLiked} variant="compact" />
      </AppPressable>
    </View>
  );
}

export const CommentRow = memo(CommentRowInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00000010",
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  authorName: {
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.bold,
  },
  bodyText: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.regular,
  },
  likeHit: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
  },
  pressed: {
    opacity: 0.7,
  },
});
