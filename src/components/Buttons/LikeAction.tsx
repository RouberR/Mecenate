import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import HeartOutline from "@/assets/images/icons/heart.svg";
import HeartSolid from "@/assets/images/icons/heart_solid.svg";

import MecenatkaOutline from "@/assets/images/icons/mecenatka.svg";
import MecenatkaSolid from "@/assets/images/icons/mecenatka_solid.svg";

import { borderRadius, typography } from "@/constants/tokens";

type Props = {
  count: number;
  active: boolean;
  variant?: "pill" | "compact";
};

export function LikeAction({ count, active, variant = "pill" }: Props) {
  const progress = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const prev = useRef(active);

  useEffect(() => {
    if (prev.current !== active) {
      prev.current = active;

      progress.value = withTiming(active ? 1 : 0, {
        duration: 220,
      });

      scale.value = withSequence(
        withSpring(1.25, { damping: 10, stiffness: 500 }),
        withSpring(0.96, { damping: 12, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 300 }),
      );

      rotate.value = withSequence(
        withTiming(-8, { duration: 80 }),
        withTiming(6, { duration: 80 }),
        withTiming(0, { duration: 120 }),
      );
    }
  }, [active]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const outlineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const solidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.8, 1]),
      },
    ],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#E5E7EB", "#FF2D6F"],
    ),
  }));

  const textStyle = useAnimatedStyle(() => {
    if (variant === "compact") {
      return { color: "#6B7280" };
    }

    return {
      color: interpolateColor(progress.value, [0, 1], ["#6B7280", "#FFFFFF"]),
    };
  });

  const OutlineIcon = variant === "pill" ? MecenatkaOutline : HeartOutline;
  const SolidIcon = variant === "pill" ? MecenatkaSolid : HeartSolid;

  const iconSize = variant === "pill" ? 18 : 18;

  if (variant === "compact") {
    return (
      <View style={styles.compactRow}>
        <Animated.View style={iconWrapStyle}>
          <Animated.View style={[StyleSheet.absoluteFill, outlineStyle]}>
            <OutlineIcon width={iconSize} height={iconSize} />
          </Animated.View>

          <Animated.View style={solidStyle}>
            <SolidIcon width={iconSize} height={iconSize} />
          </Animated.View>
        </Animated.View>

        <Animated.Text style={[styles.compactText, textStyle]}>
          {count}
        </Animated.Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.pill, pillStyle]}>
      <Animated.View style={iconWrapStyle}>
        <Animated.View style={[StyleSheet.absoluteFill, outlineStyle]}>
          <OutlineIcon width={iconSize} height={iconSize} />
        </Animated.View>

        <Animated.View style={solidStyle}>
          <SolidIcon width={iconSize} height={iconSize} />
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.text, textStyle]}>{count}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    borderRadius: borderRadius.full,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: typography.weight.bold,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compactText: {
    fontSize: typography.size.sm,
    lineHeight: 18,
    fontWeight: typography.weight.semibold,
  },
});
