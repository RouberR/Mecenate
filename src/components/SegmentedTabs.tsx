import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { borderRadius, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";
import { AppPressable } from "./AppPressable";

export type SegmentedTabItem<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  items: Array<SegmentedTabItem<T>>;
  value: T;
  onChange: (next: T) => void;
  style?: StyleProp<ViewStyle>;
};

function SegmentedTabsImpl<T extends string>({
  items,
  value,
  onChange,
  style,
}: Props<T>) {
  const theme = useTheme();
  const [wrapWidth, setWrapWidth] = useState(0);

  const index = useMemo(() => {
    const i = items.findIndex((x) => x.key === value);
    return i >= 0 ? i : 0;
  }, [items, value]);

  const segmentCount = Math.max(1, items.length);
  const segmentWidth = wrapWidth > 0 ? wrapWidth / segmentCount : 0;

  const x = useSharedValue(0);
  React.useEffect(() => {
    if (!segmentWidth) return;
    x.value = withTiming(index * segmentWidth, {
      duration: 320,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [index, segmentWidth, x]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const onLayout = useCallback((e: any) => {
    const w = e?.nativeEvent?.layout?.width ?? 0;
    if (w > 0) setWrapWidth(w);
  }, []);

  return (
    <ThemedView
      onLayout={onLayout}
      type="backgroundElement"
      style={[styles.wrap, style, { borderColor: theme.borderColor }]}
    >
      {segmentWidth ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: segmentWidth, backgroundColor: theme.primary },
            indicatorStyle,
          ]}
        />
      ) : null}

      {items.map((it) => {
        const active = it.key === value;
        return (
          <AppPressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={({ pressed }) => [styles.segment, pressed && styles.pressed]}
          >
            <View style={styles.labelWrap}>
              <ThemedText
                style={[
                  styles.text,
                  {
                    color: active
                      ? theme.backgroundElement
                      : theme.textSecondary,
                    fontWeight: active
                      ? typography.weight.bold
                      : typography.weight.medium,
                  },
                ]}
                numberOfLines={1}
              >
                {it.label}
              </ThemedText>
            </View>
          </AppPressable>
        );
      })}
    </ThemedView>
  );
}

export const SegmentedTabs = React.memo(
  SegmentedTabsImpl,
) as typeof SegmentedTabsImpl;

const styles = StyleSheet.create({
  wrap: {
    height: 38,
    borderRadius: borderRadius.full,
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: borderRadius.full,
  },
  segment: {
    flex: 1,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrap: {
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  text: {
    fontSize: typography.size.sm,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.9,
  },
});
