import React from "react";
import { StyleSheet, View } from "react-native";

import type { Post } from "@/api/types";
import { Icon } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type FeedProps = {
  variant: "feed";
  post: Post;
  isPaid: boolean;
};

type DetailProps = {
  variant: "detail";
  post?: Post;
  isLoading: boolean;
};

type Props = FeedProps | DetailProps;

export function PostCardBody(props: Props) {
  const theme = useTheme();

  if (props.variant === "feed") {
    const { post, isPaid } = props;
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

    return (
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
    );
  }

  const { post, isLoading } = props;
  const isPaid = post?.tier === "paid";

  return (
    <>
      <ThemedText style={styles.postTitle}>
        {isLoading ? "Загрузка…" : (post?.title ?? "")}
      </ThemedText>

      {isPaid ? (
        <ThemedView type="backgroundElement" style={styles.paidNotice}>
          <Icon name="donate-solid" size={28} color={theme.primary} />
          <ThemedText style={[styles.paidNoticeText, { color: theme.text }]}>
            Контент скрыт пользователем. Доступ откроется после доната
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedText style={styles.body}>{post?.body ?? ""}</ThemedText>
      )}
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
  preview: {
    fontSize: typography.size.md,
    lineHeight: 20,
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
  body: {
    fontSize: typography.size.md,
    lineHeight: 22,
    fontWeight: typography.weight.medium,
  },
});
