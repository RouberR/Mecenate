import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePostComments } from "@/api/queries/usePostComments";
import { usePostDetail } from "@/api/queries/usePostDetail";
import { ThemedView } from "@/components/ThemedView";
import { layout, spacing, typography } from "@/constants/tokens";
import { CommentComposer } from "@/screens/PostDetail/components/CommentComposer";
import { PostDetailCommentsList } from "@/screens/PostDetail/components/PostDetailCommentsList";
import { useCommentLikes } from "@/screens/PostDetail/hooks/useCommentLikes";
import { useSortedComments } from "@/screens/PostDetail/hooks/useSortedComments";

import type { Comment } from "@/api/types";
import { AppPressable } from "@/components/AppPressable";
import { PostCard } from "@/components/PostCard";
import { ErrorStatus } from "@/components/StatusComponent/ErrorStatus";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/use-theme";
import { getCommentsLabel } from "@/utils/stringsFormat";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export function PostDetailScreen() {
  const theme = useTheme();
  const { id, openComments } = useLocalSearchParams<{
    id: string;
    openComments?: string;
  }>();
  const postId = String(id ?? "");
  const shouldOpenComments = openComments === "1";

  const { data, error, isLoading, refetch } = usePostDetail(postId);
  const post = data?.data.post;

  const commentsQuery = usePostComments({ postId, limit: 20 });
  const { comments, sort, toggleSort } = useSortedComments(commentsQuery.data);
  const { likeStateById, getLikeState, toggleLike } = useCommentLikes(postId);

  const listRef = useRef<FlatList<Comment> | null>(null);
  const [commentsHeaderY, setCommentsHeaderY] = useState<number | null>(null);
  const didAutoScrollRef = useRef(false);

  const handleCommentsHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    const nextY = event.nativeEvent.layout.y;
    setCommentsHeaderY((prev) => (prev === nextY ? prev : nextY));
  }, []);

  useEffect(() => {
    if (!shouldOpenComments) return;
    if (didAutoScrollRef.current) return;
    if (commentsHeaderY == null) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, commentsHeaderY - 8),
        animated: true,
      });
      didAutoScrollRef.current = true;
    });
  }, [shouldOpenComments, commentsHeaderY, comments.length]);

  if (error) {
    return <ErrorStatus onRetry={() => refetch()} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={8}
          style={styles.keyboardWrapper}
        >
          <PostDetailCommentsList
            listRef={listRef}
            comments={comments}
            likeStateById={likeStateById}
            getLikeState={getLikeState}
            onToggleLike={toggleLike}
            commentsQuery={commentsQuery}
            isLoading={isLoading}
            ListHeaderComponent={
              post ? (
                <>
                  <PostCard post={post} type="details" />
                  <ThemedView
                    style={styles.commentsHeader}
                    onLayout={handleCommentsHeaderLayout}
                  >
                    <ThemedText themeColor="textSecondary">
                      {getCommentsLabel(comments.length)}
                    </ThemedText>
                    <AppPressable
                      onPress={toggleSort}
                      style={({ pressed }) => pressed && styles.pressed}
                    >
                      <ThemedText
                        style={[styles.sortText, { color: theme.primary }]}
                      >
                        {sort === "new" ? "Сначала новые" : "Сначала старые"}
                      </ThemedText>
                    </AppPressable>
                  </ThemedView>
                </>
              ) : null
            }
          />

          <CommentComposer postId={postId} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: layout.maxContentWidth,
  },
  keyboardWrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  commentsHeader: {
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  sortText: {
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.semibold,
  },
});
