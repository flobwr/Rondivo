import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

export type ChipDef = {
  key: string;
  label: string;
  count: number;
  color: string;
};

function Chip({ def, active, onPress }: { def: ChipDef; active: boolean; onPress: () => void }) {
  const press = useRef(new Animated.Value(1)).current;
  const selected = useRef(new Animated.Value(active ? 1 : 0)).current;
  const isAll = def.key === 'all';

  useEffect(() => {
    Animated.spring(selected, { toValue: active ? 1 : 0, useNativeDriver: false, friction: 10, tension: 120 }).start();
  }, [active, selected]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(press, { toValue: 0.93, useNativeDriver: true, friction: 6, tension: 320 }).start();
  };
  const onPressOut = () => {
    Animated.spring(press, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const backgroundColor = selected.interpolate({ inputRange: [0, 1], outputRange: [Palette.card, def.color] });
  const borderColor = selected.interpolate({ inputRange: [0, 1], outputRange: [Palette.border, def.color] });
  const labelColor = selected.interpolate({ inputRange: [0, 1], outputRange: [Palette.textPrimary, Palette.white] });
  const countColor = selected.interpolate({ inputRange: [0, 1], outputRange: [Palette.textTertiary, Palette.white] });
  const countOpacity = selected.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] });
  const dotColor = selected.interpolate({ inputRange: [0, 1], outputRange: [def.color, Palette.white] });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${def.label}, ${def.count}`}>
      <Animated.View
        style={[
          styles.chip,
          { transform: [{ scale: press }], backgroundColor, borderColor },
          active ? actionShadow : null,
        ]}>
        {!isAll ? <Animated.View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
        <Animated.Text style={[styles.label, { color: labelColor }]}>{def.label}</Animated.Text>
        <Animated.Text style={[styles.count, { color: countColor, opacity: countOpacity }]}>{def.count}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export function FilterChips({
  defs,
  activeKey,
  onSelect,
}: {
  defs: ChipDef[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled">
      {defs.map((def) => {
        const active = def.key === 'all' ? activeKey === null : activeKey === def.key;
        return (
          <Chip key={def.key} def={def} active={active} onPress={() => onSelect(def.key === 'all' ? null : def.key)} />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 7,
    paddingHorizontal: Spacing.screen,
    paddingVertical: 3,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
