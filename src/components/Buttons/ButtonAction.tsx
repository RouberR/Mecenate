import React from "react";
import { StyleSheet, View } from "react-native";

import { LikeAction } from "@/components/Buttons/LikeAction";
import { Icon } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { borderRadius, typography } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

export type ButtonActionType = "like" | "comment";

type Props = {
  type: ButtonActionType;
  count: number;
  active?: boolean;
};

export function ButtonAction({ type, count, active = false }: Props) {
  const theme = useTheme();

  if (type === "like") {
    return <LikeAction count={count} active={active} />;
  }

  const fg = theme.textSecondary;

  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
      <Icon name="comment-solid" size={18} color={fg} />
      <ThemedText style={[styles.text, { color: fg }]}>{count}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    borderRadius: borderRadius.full,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: typography.weight.bold,
  },
});
