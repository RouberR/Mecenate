import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import { useToggleLike } from "@/api/queries/usePostMutations";
import type { Post } from "@/api/types";
import { PostCardActions } from "@/components/PostCard/PostCardActions";
import { PostCardBody } from "@/components/PostCard/PostCardBody";
import { PostCardHeader } from "@/components/PostCard/PostCardHeader";
import { PostCardMedia } from "@/components/PostCard/PostCardMedia";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing } from "@/constants/tokens";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const isPaid = post.tier === "paid";
  const likeActive = Boolean(post.isLiked);
  const toggleLike = useToggleLike();

  return (
    <Pressable
      onPress={
        isPaid
          ? undefined
          : () => {
              router.push({ pathname: "/posts/[id]", params: { id: post.id } });
            }
      }
      disabled={isPaid}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView type="backgroundElement" style={styles.card}>
        <PostCardHeader variant="feed" author={post.author} />
        <PostCardMedia post={post} isPaid={isPaid} />
        <PostCardBody variant="feed" post={post} isPaid={isPaid} />
        {isPaid ? null : (
          <PostCardActions
            variant="feed"
            post={post}
            likeActive={likeActive}
            toggleLikePending={toggleLike.isPending}
            onToggleLike={() => toggleLike.mutate(post.id)}
          />
        )}
      </ThemedView>
    </Pressable>
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
  pressed: {
    opacity: 0.7,
  },
});
