import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { PressSpring, Radius, SettleSpring, Spacing } from '@/theme';

export type ChipItem = {
  key: string;
  label: string;
  count?: number;
  /** Vivid status colour — drawn ONLY as the dot, never as a chip fill. */
  dotColor?: string;
};

function Chip({
  item,
  active,
  onPress,
}: {
  item: ChipItem;
  active: boolean;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  const press = useRef(new Animated.Value(1)).current;
  const selected = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(selected, { toValue: active ? 1 : 0, useNativeDriver: false, ...SettleSpring }).start();
  }, [active, selected]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(press, { toValue: 0.93, useNativeDriver: true, ...PressSpring.in }).start();
  };
  const onPressOut = () => {
    Animated.spring(press, { toValue: 1, useNativeDriver: true, ...PressSpring.out }).start();
  };

  const backgroundColor = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.card, palette.textPrimary],
  });
  const borderColor = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.border, palette.textPrimary],
  });
  const labelColor = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.textPrimary, palette.screen],
  });
  const countColor = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.textTertiary, palette.screen],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.count != null ? `${item.label}, ${item.count}` : item.label}>
      <Animated.View
        style={[styles.chip, { transform: [{ scale: press }], backgroundColor, borderColor }]}>
        {item.dotColor ? (
          <Animated.View style={[styles.dot, { backgroundColor: item.dotColor }]} />
        ) : null}
        <Animated.Text style={[styles.label, { color: labelColor }]}>{item.label}</Animated.Text>
        {item.count != null ? (
          <Animated.Text style={[styles.count, { color: countColor }]}>{item.count}</Animated.Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Rondivo chip row — the DS's one horizontal filter strip.
 *
 * Selection is MONOCHROME: the active chip fills with the text ink and its
 * label flips to the paper colour — status colours stay confined to their
 * dots, so a row of filters never paints the screen. The chip whose key is
 * `'all'` represents "no filter" and reports `null` on select.
 */
export function ChipRow({
  items,
  activeKey,
  onSelect,
}: {
  items: ChipItem[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled">
      {items.map((item) => {
        const active = item.key === 'all' ? activeKey === null : activeKey === item.key;
        return (
          <Chip
            key={item.key}
            item={item}
            active={active}
            onPress={() => onSelect(item.key === 'all' ? null : item.key)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screen,
    paddingVertical: 3,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  count: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
