import React from "react";
import { StyleSheet, View } from "react-native";

import type { Author } from "@/api/types";
import { AppImage } from "@/components/AppImage";
import { ThemedText } from "@/components/ThemedText";
import { typography } from "@/constants/tokens";

type Props = {
  variant: "feed" | "detail";
  author?: Author;
};

export function PostCardHeader({ variant, author }: Props) {
  if (!author) return null;
  const isFeed = variant === "feed";

  return (
    <View style={[styles.container, isFeed ? styles.feed : styles.detail]}>
      {author.avatarUrl ? (
        <AppImage
          source={{ uri: author.avatarUrl }}
          style={[
            styles.avatar,
            isFeed ? styles.avatarFeed : styles.avatarDetail,
          ]}
        />
      ) : null}

      <ThemedText style={styles.name}>{author.displayName}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  feed: {
    gap: 12,
  },

  detail: {
    gap: 10,
    paddingTop: 2,
    paddingBottom: 6,
  },

  avatar: {
    backgroundColor: "#00000010",
  },

  avatarFeed: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarDetail: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  name: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.bold,
  },
});
