import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { SORT_META, STATUS_META, type ClientStatus, type SortKey } from '@/components/clients/types';

const ALL_STATUSES = Object.keys(STATUS_META) as ClientStatus[];
const ALL_SORTS = Object.keys(SORT_META) as SortKey[];

type ClientFiltersProps = {
  visible: boolean;
  selectedStatuses: ClientStatus[];
  onToggleStatus: (status: ClientStatus) => void;
  sortKey: SortKey;
  onChangeSort: (key: SortKey) => void;
  onReset: () => void;
};

function Chip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  const tint = color ?? Palette.blue;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: tint }
          : { backgroundColor: Palette.cardMuted, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
      ]}>
      <Text style={[styles.chipText, { color: active ? Palette.white : Palette.textPrimary }]}>{label}</Text>
    </Pressable>
  );
}

export function ClientFilters({
  visible,
  selectedStatuses,
  onToggleStatus,
  sortKey,
  onChangeSort,
  onReset,
}: ClientFiltersProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }),
            },
          ],
        },
      ]}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statut</Text>
        <View style={styles.chipRow}>
          {ALL_STATUSES.map((status) => (
            <Chip
              key={status}
              label={STATUS_META[status].label}
              color={STATUS_META[status].color}
              active={selectedStatuses.includes(status)}
              onPress={() => onToggleStatus(status)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trier par</Text>
        <View style={styles.chipRow}>
          {ALL_SORTS.map((key) => (
            <Chip
              key={key}
              label={SORT_META[key].label}
              active={sortKey === key}
              onPress={() => onChangeSort(key)}
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onReset();
        }}
        hitSlop={8}
        style={styles.resetRow}>
        <Text style={styles.resetText}>Réinitialiser les filtres</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: Palette.textTertiary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  resetRow: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.blue,
  },
});
