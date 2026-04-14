import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import type { Comment } from "@/api/types";
import { ThemedText } from "@/components/ThemedText";
import { spacing } from "@/constants/tokens";
import { CommentRow } from "@/screens/PostDetail/components/CommentRow";

type CommentsQuery = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

type Props = {
  listRef: React.RefObject<FlatList<Comment> | null>;
  comments: Comment[];
  commentLikes: Record<string, { count: number; isLiked: boolean }>;
  setCommentLikes: React.Dispatch<
    React.SetStateAction<Record<string, { count: number; isLiked: boolean }>>
  >;
  commentsQuery: CommentsQuery;
  isLoading: boolean;
  ListHeaderComponent: React.ReactElement;
};

export function PostDetailCommentsList({
  listRef,
  comments,
  commentLikes,
  setCommentLikes,
  commentsQuery,
  isLoading,
  ListHeaderComponent,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentRow
        comment={item}
        likeState={
          commentLikes[item.id] ?? {
            count: item.likesCount ?? 0,
            isLiked: item.isLiked ?? false,
          }
        }
        onToggleLike={() => {
          setCommentLikes((prev) => {
            const current = prev[item.id] ?? {
              count: item.likesCount ?? 0,
              isLiked: item.isLiked ?? false,
            };
            const nextLiked = !current.isLiked;
            const nextCount = Math.max(0, current.count + (nextLiked ? 1 : -1));
            return {
              ...prev,
              [item.id]: { count: nextCount, isLiked: nextLiked },
            };
          });
        }}
      />
    ),
    [commentLikes, setCommentLikes],
  );

  return (
    <FlatList
      ref={(r) => {
        listRef.current = r;
      }}
      data={comments}
      keyExtractor={(item) => item.id}
      extraData={commentLikes}
      contentContainerStyle={styles.listContent}
      onEndReachedThreshold={0.6}
      onEndReached={() => {
        if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
          commentsQuery.fetchNextPage();
        }
      }}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      ListEmptyComponent={
        isLoading ? null : (
          <ThemedText themeColor="textSecondary" style={styles.emptyText}>
            Пока нет комментариев
          </ThemedText>
        )
      }
      ListFooterComponent={
        commentsQuery.isFetchingNextPage ? (
          <ThemedText themeColor="textSecondary" style={styles.footerText}>
            Загрузка…
          </ThemedText>
        ) : (
          <View style={{ height: 8 }} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 4,
    paddingBottom: spacing.lg,
    gap: 0,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  footerText: {
    paddingVertical: 8,
    textAlign: "center",
  },
});
