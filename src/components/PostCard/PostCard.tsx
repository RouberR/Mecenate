import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { useToggleLike } from "@/api/queries/usePostMutations";
import type { Post } from "@/api/types";
import { PostCardActions } from "@/components/PostCard/PostCardActions";
import { PostCardBody } from "@/components/PostCard/PostCardBody";
import { PostCardHeader } from "@/components/PostCard/PostCardHeader";
import { PostCardMedia } from "@/components/PostCard/PostCardMedia";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing } from "@/constants/tokens";
import { AppPressable } from "../AppPressable";

export type CardType = "details" | "preview";
type Props = {
  post: Post;
  type: CardType;
};

export function PostCard({ post, type }: Props) {
  const isPaid = post.tier === "paid";
  const likeActive = Boolean(post.isLiked);
  const toggleLike = useToggleLike();

  return (
    <AppPressable
      disabled={isPaid || type === "details"}
      onPress={() => {
        router.push({ pathname: "/posts/[id]", params: { id: post.id } });
      }}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView type="backgroundElement" style={styles.card}>
        <PostCardHeader variant="feed" author={post.author} />
        <View style={styles.content}>
          <PostCardMedia post={post} isPaid={isPaid} />
          <PostCardBody
            variant="feed"
            post={post}
            isPaid={isPaid}
            type={type}
          />
        </View>
        {isPaid ? null : (
          <PostCardActions
            post={post}
            likeActive={likeActive}
            toggleLikePending={toggleLike.isPending}
            onToggleLike={() => toggleLike.mutate(post.id)}
            type={type}
          />
        )}
      </ThemedView>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 16,
    overflow: "hidden",
  },
  content: {
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
