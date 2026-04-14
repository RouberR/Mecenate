import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFeedPosts } from "@/api/queries/useFeedPosts";
import type { Post, PostTier } from "@/api/types";
import { PostCard } from "@/components/PostCard";
import { ErrorStatus } from "@/components/StatusComponent/ErrorStatus";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { spacing } from "@/constants/tokens";
import { TabsHeader } from "./components/TabsHeader";

export function FeedScreen() {
  const [tier, setTier] = useState<PostTier | "all">("all");
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const listRef = React.useRef<FlatList<any> | null>(null);

  const onTierChange = useCallback((next: PostTier | "all") => {
    setTier(next);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, []);

  const {
    data,
    error,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedPosts({ limit: 10, tier });

  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.data.posts) ?? [],
    [data?.pages],
  );
  const showError = Boolean(error) && posts.length === 0;

  const renderItem = useCallback(({ item }: { item: Post }) => {
    return <PostCard post={item} type="preview" />;
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {showError ? (
          <ErrorStatus
            title="Не удалось загрузить публикацию"
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <TabsHeader onChange={onTierChange} currentItem={tier} />
            <FlatList
              ref={(r) => {
                listRef.current = r;
              }}
              data={posts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              // ListHeaderComponent={tabsHeader}
              // stickyHeaderIndices={[0]}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              refreshing={pullRefreshing}
              removeClippedSubviews={true}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={7}
              updateCellsBatchingPeriod={50}
              onRefresh={async () => {
                setPullRefreshing(true);
                try {
                  await refetch();
                } finally {
                  setPullRefreshing(false);
                }
              }}
              onEndReachedThreshold={0.4}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              ListEmptyComponent={
                isLoading ? (
                  <ThemedView style={styles.centerState}>
                    <ThemedText themeColor="textSecondary">
                      Загрузка…
                    </ThemedText>
                  </ThemedView>
                ) : null
              }
              ListFooterComponent={
                isFetchingNextPage ? (
                  <ThemedView style={styles.footer}>
                    <ThemedText themeColor="textSecondary">
                      Загрузка…
                    </ThemedText>
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.footer} />
                )
              }
            />
          </>
        )}
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
  },
  listContent: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
    paddingHorizontal: 0,
  },
  tabsHeader: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },

  pressed: {
    opacity: 0.7,
  },
  footer: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});
