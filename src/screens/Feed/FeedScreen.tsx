import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFeedPosts } from "@/api/queries/useFeedPosts";
import { Button } from "@/components/Buttons/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, spacing, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { PostCard } from "@/screens/Feed/components/PostCard";
import { Image } from "expo-image";

export function FeedScreen() {
  const theme = useTheme();
  const {
    data,
    error,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedPosts({ limit: 10 });

  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.data.posts) ?? [],
    [data],
  );
  const showError = Boolean(error) && posts.length === 0;

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
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <PostCard post={item} />}
            refreshing={isRefetching && posts.length > 0}
            onRefresh={() => refetch()}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: 16,
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
