import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";

import type { Post } from "@/api/types";
import { ButtonAction } from "@/components/Buttons/ButtonAction";
import { spacing } from "@/constants/tokens";

type FeedProps = {
  variant: "feed";
  post: Post;
  likeActive: boolean;
  toggleLikePending: boolean;
  onToggleLike: () => void;
};

type DetailProps = {
  variant: "detail";
  post: Post;
  commentCountStyle: AnimatedStyle<ViewStyle>;
  onPressLike: () => void;
  toggleLikePending: boolean;
};

type Props = FeedProps | DetailProps;

export function PostCardActions(props: Props) {
  if (props.variant === "feed") {
    const { post, likeActive, toggleLikePending, onToggleLike } = props;
    return (
      <View style={styles.buttonsRow}>
        <Pressable
          onPress={async (e) => {
            e.stopPropagation();
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (e) {
              console.log("Error PostCardActions", e);
            }
            onToggleLike();
          }}
          disabled={toggleLikePending}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ButtonAction
            type="like"
            count={post.likesCount}
            active={likeActive}
          />
        </Pressable>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            router.push({
              pathname: "/posts/[id]",
              params: { id: post.id, openComments: "1" },
            });
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ButtonAction type="comment" count={post.commentsCount} />
        </Pressable>
      </View>
    );
  }

  const { post, commentCountStyle, onPressLike, toggleLikePending } = props;

  return (
    <View style={styles.buttonsRow}>
      <Pressable
        onPress={onPressLike}
        disabled={toggleLikePending}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ButtonAction
          type="like"
          count={post.likesCount}
          active={post.isLiked}
        />
      </Pressable>

      <Animated.View style={commentCountStyle}>
        <ButtonAction type="comment" count={post.commentsCount} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
