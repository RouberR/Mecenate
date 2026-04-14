import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePostComments } from "@/api/queries/usePostComments";
import { usePostDetail } from "@/api/queries/usePostDetail";
import { useAddComment, useToggleLike } from "@/api/queries/usePostMutations";
import { ThemedView } from "@/components/ThemedView";
import { layout } from "@/constants/tokens";
import { CommentComposer } from "@/screens/PostDetail/components/CommentComposer";
import { PostDetailCommentsList } from "@/screens/PostDetail/components/PostDetailCommentsList";
import { PostDetailError } from "@/screens/PostDetail/components/PostDetailError";
import { PostDetailHeader } from "@/screens/PostDetail/components/PostDetailHeader";

import type { Comment } from "@/api/types";

export function PostDetailScreen() {
  const { id, openComments } = useLocalSearchParams<{
    id: string;
    openComments?: string;
  }>();
  const postId = String(id ?? "");
  const shouldOpenComments = openComments === "1";

  const { data, error, isLoading, refetch } = usePostDetail(postId);
  const post = data?.data.post;

  const commentsQuery = usePostComments({ postId, limit: 20 });
  const [sort, setSort] = useState<"new" | "old">("new");
  const comments = useMemo(() => {
    const flat =
      commentsQuery.data?.pages.flatMap((p) => p.data.comments) ?? [];
    const next = [...flat].sort((a, b) =>
      sort === "new"
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(a.createdAt) - +new Date(b.createdAt),
    );
    return next;
  }, [commentsQuery.data, sort]);

  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const [text, setText] = useState("");
  const [commentLikes, setCommentLikes] = useState<
    Record<string, { count: number; isLiked: boolean }>
  >({});
  const listRef = useRef<FlatList<Comment> | null>(null);
  const commentsHeaderYRef = useRef<number | null>(null);
  const didAutoScrollRef = useRef(false);

  const commentCountScale = useSharedValue(1);

  const commentCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: commentCountScale.value }],
  }));

  useEffect(() => {
    if (post?.commentsCount == null) return;
    commentCountScale.value = withSequence(
      withTiming(1.08, { duration: 120 }),
      withSpring(1, { damping: 14, stiffness: 220 }),
    );
  }, [post?.commentsCount, commentCountScale]);

  useEffect(() => {
    if (!shouldOpenComments) return;
    if (didAutoScrollRef.current) return;
    const y = commentsHeaderYRef.current;
    if (y == null) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: Math.max(0, y - 8),
        animated: true,
      });
      didAutoScrollRef.current = true;
    });
  }, [shouldOpenComments, comments.length]);

  if (error) {
    return <PostDetailError onRetry={() => refetch()} />;
  }

  const commentsCountLabel = `${post?.commentsCount ?? comments.length} комментария`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
          style={{ flex: 1 }}
        >
          <PostDetailCommentsList
            listRef={listRef}
            comments={comments}
            commentLikes={commentLikes}
            setCommentLikes={setCommentLikes}
            commentsQuery={commentsQuery}
            isLoading={isLoading}
            ListHeaderComponent={
              <PostDetailHeader
                post={post}
                isLoading={isLoading}
                sort={sort}
                onToggleSort={() =>
                  setSort((s) => (s === "new" ? "old" : "new"))
                }
                commentsCountLabel={commentsCountLabel}
                commentCountStyle={commentCountStyle}
                toggleLikePending={toggleLike.isPending}
                onPressLike={async () => {
                  if (!post) return;
                  try {
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    );
                  } catch (e) {
                    console.log("Error onPressLike", e);
                  }

                  toggleLike.mutate(post.id);
                }}
                onCommentsHeaderLayout={(y) => {
                  commentsHeaderYRef.current = y;
                }}
              />
            }
          />

          <CommentComposer
            text={text}
            onChangeText={setText}
            disabled={addComment.isPending}
            sendDisabled={addComment.isPending || text.trim().length === 0}
            onSend={() => {
              const trimmed = text.trim();
              if (!trimmed || !postId) return;
              addComment.mutate(
                { postId, text: trimmed },
                {
                  onSuccess: () => setText(""),
                },
              );
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    maxWidth: layout.maxContentWidth,
  },
});
