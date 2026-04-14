import React from "react";
import { StyleSheet, View } from "react-native";

import type { Author } from "@/api/types";
import { AppImage } from "@/components/AppImage";
import { ThemedText } from "@/components/ThemedText";
import { typography } from "@/constants/tokens";

type FeedProps = {
  variant: "feed";
  author: Author;
};

type DetailProps = {
  variant: "detail";
  author?: Author;
};

type Props = FeedProps | DetailProps;

export function PostCardHeader(props: Props) {
  if (props.variant === "feed") {
    const { author } = props;
    return (
      <View style={styles.header}>
        <AppImage source={{ uri: author.avatarUrl }} style={styles.avatar} />
        <View style={styles.headerText}>
          <ThemedText style={styles.authorName}>{author.displayName}</ThemedText>
        </View>
      </View>
    );
  }

  const { author } = props;
  return (
    <View style={styles.topAuthorRow}>
      {author?.avatarUrl ? (
        <AppImage
          source={{ uri: author.avatarUrl }}
          style={styles.topAvatar}
        />
      ) : null}
      <ThemedText style={styles.topAuthorName}>
        {author?.displayName ?? ""}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00000010",
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.bold,
  },
  topAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 2,
    paddingBottom: 6,
  },
  topAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00000010",
  },
  topAuthorName: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.bold,
  },
});
