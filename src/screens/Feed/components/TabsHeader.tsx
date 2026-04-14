import { PostTier } from "@/api/types";
import { SegmentedTabItem, SegmentedTabs } from "@/components/SegmentedTabs";
import { ThemedView } from "@/components/ThemedView";
import { spacing } from "@/constants/tokens";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

type props = {
  onChange: (item: PostTier | "all") => void;
  currentItem: PostTier | "all";
};

export function TabsHeader({ onChange = () => {}, currentItem }: props) {
  const tabItems = useMemo<SegmentedTabItem<PostTier | "all">[]>(
    () => [
      { key: "all", label: "Все" },
      { key: "free", label: "Бесплатные" },
      { key: "paid", label: "Платные" },
    ],
    [],
  );

  return (
    <ThemedView type="background" style={styles.tabsHeader}>
      <SegmentedTabs items={tabItems} value={currentItem} onChange={onChange} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabsHeader: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
