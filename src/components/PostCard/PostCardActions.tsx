import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import type { Post } from "@/api/types";
import { ButtonAction } from "@/components/Buttons/ButtonAction";
import { spacing } from "@/constants/tokens";
import { AppPressable } from "../AppPressable";
import { CardType } from "./PostCard";

type Props = {
  post: Post;
  likeActive: boolean;
  toggleLikePending: boolean;
  onToggleLike: () => void;
  type: CardType;
};

export function PostCardActions({
  post,
  likeActive,
  toggleLikePending,
  onToggleLike,
  type,
}: Props) {
  return (
    <View style={styles.buttonsRow}>
      <AppPressable
        onPress={async (e) => {
          e.stopPropagation();

          try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (err) {
            console.log("Haptics error PostCardActions", err);
          }

          onToggleLike();
        }}
        disabled={toggleLikePending}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ButtonAction type="like" count={post.likesCount} active={likeActive} />
      </AppPressable>

      <AppPressable
        onPress={(e) => {
          if (type === "details") {
            return;
          }
          e.stopPropagation();
          router.push({
            pathname: "/posts/[id]",
            params: { id: post.id, openComments: "1" },
          });
        }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ButtonAction type="comment" count={post.commentsCount} />
      </AppPressable>
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
