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

type LikeState = { count: number; isLiked: boolean };

type Props = {
  listRef: React.RefObject<FlatList<Comment> | null>;
  comments: Comment[];
  likeStateById: Record<string, LikeState>;
  getLikeState: (comment: Comment) => LikeState;
  onToggleLike: (comment: Comment) => void;
  commentsQuery: CommentsQuery;
  isLoading: boolean;
  ListHeaderComponent: React.ReactElement | null;
};

export function PostDetailCommentsList({
  listRef,
  comments,
  likeStateById,
  getLikeState,
  onToggleLike,
  commentsQuery,
  isLoading,
  ListHeaderComponent,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentRow
        comment={item}
        likeState={getLikeState(item)}
        onToggleLike={() => onToggleLike(item)}
      />
    ),
    [getLikeState, onToggleLike],
  );

  return (
    <FlatList
      ref={(r) => {
        listRef.current = r;
      }}
      data={comments}
      keyExtractor={(item) => item.id}
      extraData={likeStateById}
      showsVerticalScrollIndicator={false}
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
    paddingBottom: spacing.lg,
    gap: 0,
    backgroundColor: "white",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
