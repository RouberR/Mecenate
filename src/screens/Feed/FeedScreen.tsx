import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFeedPosts } from "@/api/queries/useFeedPosts";
import type { PostTier } from "@/api/types";
import { Button } from "@/components/Buttons/Button";
import { PostCard } from "@/components/PostCard";
import {
  SegmentedTabs,
  type SegmentedTabItem,
} from "@/components/SegmentedTabs";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { Image } from "expo-image";

export function FeedScreen() {
  const [tier, setTier] = useState<PostTier | "all">("all");
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const listRef = React.useRef<FlatList<any> | null>(null);

  const onTierChange = useCallback((next: PostTier | "all") => {
    setTier(next);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
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
    [data],
  );
  const showError = Boolean(error) && posts.length === 0;

  const tabItems = useMemo<SegmentedTabItem<PostTier | "all">[]>(
    () => [
      { key: "all", label: "Все" },
      { key: "free", label: "Бесплатные" },
      { key: "paid", label: "Платные" },
    ],
    [],
  );

  const tabsHeader = useMemo(
    () => (
      <ThemedView type="background" style={styles.tabsHeader}>
        <SegmentedTabs
          items={tabItems}
          value={tier}
          onChange={onTierChange}
          style={styles.tabs}
        />
      </ThemedView>
    ),
    [onTierChange, tabItems, tier],
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {showError ? (
          <ThemedView type="backgroundElement" style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Image
                source={require("../../../assets/images/icons/illustration_sticker.png")}
                style={{ width: 112, height: 112 }}
              />
            </View>
            <ThemedText style={styles.errorTitle}>
              Не удалось загрузить публикации
            </ThemedText>
            <Button title="Повторить" onPress={() => refetch()} />
          </ThemedView>
        ) : (
          <FlatList
            ref={(r) => {
              listRef.current = r;
            }}
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={tabsHeader}
            stickyHeaderIndices={[0]}
            renderItem={({ item }) => <PostCard post={item} />}
            refreshing={pullRefreshing}
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
                  <ThemedText themeColor="textSecondary">Загрузка…</ThemedText>
                </ThemedView>
              ) : null
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <ThemedView style={styles.footer}>
                  <ThemedText themeColor="textSecondary">Загрузка…</ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.footer} />
              )
            }
          />
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: 12,
    paddingHorizontal: 0,
  },
  tabsHeader: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tabs: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  errorCard: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 16,
    alignItems: "center",
  },
  errorIcon: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: typography.size.lg,
    lineHeight: 26,
    fontWeight: typography.weight.bold,
    textAlign: "center",
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
