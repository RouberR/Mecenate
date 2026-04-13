import { Image } from "expo-image";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { Post } from "@/api/types";
import { ButtonAction } from "@/components/Buttons/ButtonAction";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const theme = useTheme();
  const isPaid = post.tier === "paid";
  const likeActive = Boolean(post.isLiked);
  console.log("post", post);
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/posts/[id]",
          params: { id: post.id },
        } as any)
      }
      style={({ pressed }) => pressed && styles.pressed}
    >
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.header}>
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <ThemedText style={styles.authorName}>
              {post.author.displayName}
            </ThemedText>
          </View>
        </View>

        <View style={styles.mediaBlock}>
          <Image
            source={{ uri: post.coverUrl }}
            style={styles.cover}
            contentFit="cover"
          />

          {isPaid ? (
            <View style={styles.paidOverlay}>
              <View
                style={[
                  styles.paidIconWrap,
                  { backgroundColor: theme.primary },
                ]}
              >
                <SymbolView
                  tintColor="#FFFFFF"
                  name={{
                    ios: "dollarsign.circle.fill",
                    android: "paid",
                    web: "paid",
                  }}
                  size={22}
                />
              </View>
              <ThemedText style={styles.paidText}>
                Контент скрыт пользователем.{"\n"}Доступ откроется после доната
              </ThemedText>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <View
                  style={[
                    styles.paidButton,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <ThemedText style={styles.paidButtonText}>
                    Отправить донат
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          ) : null}
        </View>

        {isPaid ? (
          <View style={styles.paidSkeletonWrap}>
            <View
              style={[
                styles.skeletonTitle,
                { backgroundColor: theme.skeleton },
              ]}
            />
            <View
              style={[styles.skeletonText, { backgroundColor: theme.skeleton }]}
            />
          </View>
        ) : (
          <>
            <ThemedText style={styles.title} numberOfLines={1}>
              {post.title}
            </ThemedText>
            <ThemedText
              style={[styles.preview, { color: theme.text }]}
              numberOfLines={2}
            >
              {post.preview}
            </ThemedText>
          </>
        )}

        <View style={styles.buttonsRow}>
          <ButtonAction
            type="like"
            count={post.likesCount}
            active={likeActive}
          />
          <ButtonAction type="comment" count={post.commentsCount} />
        </View>
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
  mediaBlock: {
    gap: 8,
  },
  title: {
    fontSize: typography.size.lg,
    lineHeight: 26,
    fontWeight: typography.weight.bold,
  },
  cover: {
    alignSelf: "stretch",
    marginHorizontal: -spacing.md,
    aspectRatio: 1,
    backgroundColor: "#00000010",
  },
  paidOverlay: {
    position: "absolute",
    left: -spacing.md,
    right: -spacing.md,
    top: 0,
    aspectRatio: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    gap: 8,
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
  preview: {
    fontSize: typography.size.md,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
