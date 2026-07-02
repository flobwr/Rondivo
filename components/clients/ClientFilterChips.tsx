import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { STATUS_META, STATUS_ORDER, type ClientStatus } from '@/components/clients/types';

type ChipDef = {
  key: ClientStatus | 'all';
  label: string;
  count: number;
  color: string;
};

type ClientFilterChipsProps = {
  counts: Record<ClientStatus, number>;
  total: number;
  activeStatus: ClientStatus | null;
  onSelect: (status: ClientStatus | null) => void;
};

function Chip({ def, active, onPress }: { def: ChipDef; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const isAll = def.key === 'all';

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, friction: 6, tension: 320 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${def.label}, ${def.count}`}>
      <Animated.View
        style={[
          styles.chip,
          { transform: [{ scale }] },
          active ? { backgroundColor: def.color, borderColor: def.color } : styles.chipInactive,
        ]}>
        {!isAll ? (
          <View style={[styles.dot, { backgroundColor: active ? Palette.white : def.color }]} />
        ) : null}
        <Text style={[styles.label, { color: active ? Palette.white : Palette.textPrimary }]}>{def.label}</Text>
        <Text style={[styles.count, { color: active ? Palette.white : Palette.textTertiary }]}>{def.count}</Text>
      </Animated.View>
    </Pressable>
  );
}

function ClientFilterChipsComponent({ counts, total, activeStatus, onSelect }: ClientFilterChipsProps) {
  const defs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: total, color: Palette.blue },
    ...STATUS_ORDER.map((status) => ({
      key: status,
      label: STATUS_META[status].label,
      count: counts[status],
      color: STATUS_META[status].color,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled">
      {defs.map((def) => {
        const active = def.key === 'all' ? activeStatus === null : activeStatus === def.key;
        return (
          <Chip
            key={def.key}
            def={def}
            active={active}
            onPress={() => onSelect(def.key === 'all' ? null : (def.key as ClientStatus))}
          />
        );
      })}
    </ScrollView>
  );
}

export const ClientFilterChips = memo(ClientFilterChipsComponent);

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: Spacing.screen,
    paddingVertical: 2,
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
  chipInactive: {
    backgroundColor: Palette.card,
    borderColor: Palette.border,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
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
