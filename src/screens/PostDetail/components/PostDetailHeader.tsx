import React from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { type AnimatedStyle } from "react-native-reanimated";

import type { Post } from "@/api/types";
import {
  PostCardActions,
  PostCardBody,
  PostCardHeader,
  PostCardMedia,
} from "@/components/PostCard";
import { ThemedText } from "@/components/ThemedText";
import { spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  post?: Post;
  isLoading: boolean;
  sort: "new" | "old";
  onToggleSort: () => void;
  commentsCountLabel: string;
  commentCountStyle: AnimatedStyle<ViewStyle>;
  onPressLike: () => void;
  toggleLikePending: boolean;
  onCommentsHeaderLayout: (y: number) => void;
};

export function PostDetailHeader({
  post,
  isLoading,
  sort,
  onToggleSort,
  commentsCountLabel,
  commentCountStyle,
  onPressLike,
  toggleLikePending,
  onCommentsHeaderLayout,
}: Props) {
  const theme = useTheme();
  const isPaid = post?.tier === "paid";

  return (
    <View style={styles.detailSection}>
      <PostCardHeader variant="detail" author={post?.author} />

      {post?.coverUrl ? (
        <PostCardMedia post={post} isPaid={Boolean(isPaid)} />
      ) : null}

      <PostCardBody variant="detail" post={post} isLoading={isLoading} />

      {post ? (
        <PostCardActions
          variant="detail"
          post={post}
          commentCountStyle={commentCountStyle}
          onPressLike={onPressLike}
          toggleLikePending={toggleLikePending}
        />
      ) : null}

      <View style={styles.commentsHeader}>
        <ThemedText themeColor="textSecondary" style={styles.commentsCount}>
          {commentsCountLabel}
        </ThemedText>
        <Pressable
          onPress={onToggleSort}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ThemedText style={[styles.sortText, { color: theme.primary }]}>
            {sort === "new" ? "Сначала новые" : "Сначала старые"}
          </ThemedText>
        </Pressable>
      </View>

      <View
        onLayout={(e: LayoutChangeEvent) => {
          onCommentsHeaderLayout(e.nativeEvent.layout.y);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  detailSection: {
    gap: 12,
    paddingBottom: spacing.md,
  },
  commentsHeader: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentsCount: {
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.medium,
  },
  sortText: {
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.semibold,
  },
  pressed: {
    opacity: 0.7,
  },
});
