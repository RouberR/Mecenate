import { SymbolView } from 'expo-symbols';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { borderRadius, typography } from '@/constants/tokens';
import { useTheme } from '@/hooks/use-theme';

export type ButtonActionType = 'like' | 'comment';

type Props = {
  type: ButtonActionType;
  count: number;
  active?: boolean;
};

export function ButtonAction({ type, count, active = false }: Props) {
  const theme = useTheme();

  const bg = active ? theme.likeActive : theme.backgroundSelected;
  const fg = active ? theme.likeActiveText : theme.textSecondary;

  const iconName =
    type === 'like'
      ? ({ ios: active ? 'heart.fill' : 'heart', android: 'favorite', web: 'favorite' } as any)
      : ({ ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' } as any);

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <SymbolView tintColor={fg} name={iconName} size={18} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: typography.weight.bold,
  },
});

