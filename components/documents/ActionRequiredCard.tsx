import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { ActionItem } from './types';

const TILE = 38;

function ActionRow({ item, onPress }: { item: ActionItem; onPress?: () => void }) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const tint = item.tone === 'red' ? Palette.notification : Palette.orange;
  const tintSoft = item.tone === 'red' ? Palette.redSoft : Palette.orangeSoft;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.row, { transform: [{ scale: pressScale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: tintSoft }]}>
          <Feather name={item.icon} size={17} color={tint} />
        </View>
        <Text style={styles.rowText} numberOfLines={1} ellipsizeMode="tail">
          {item.text}
        </Text>
        <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
      </Animated.View>
    </Pressable>
  );
}

export function ActionRequiredCard({
  items,
  onItemPress,
}: {
  items: ActionItem[];
  onItemPress?: (item: ActionItem) => void;
}) {
  if (items.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyRow}>
          <View style={[styles.iconTile, { backgroundColor: Palette.greenSoft }]}>
            <Feather name="check" size={17} color={Palette.green} />
          </View>
          <Text style={styles.emptyText}>Tout est à jour.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <ActionRow item={item} onPress={() => onItemPress?.(item)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
