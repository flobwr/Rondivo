import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

export type FilterChip = {
  label: string;
  count?: number;
  dotColor?: string;
};

type Props = {
  chips: FilterChip[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function FilterChips({ chips, selectedIndex, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {chips.map((chip, index) => {
          const active = index === selectedIndex;
          return (
            <Pressable
              key={chip.label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelect(index);
              }}>
              {!active && chip.dotColor ? (
                <View style={[styles.dot, { backgroundColor: chip.dotColor }]} />
              ) : null}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label}
              </Text>
              {chip.count !== undefined ? (
                <Text style={[styles.chipCount, active && styles.chipCountActive]}>
                  {chip.count}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.lg,
  },
  scroll: {
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Palette.card,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Palette.blue,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
  },
  chipTextActive: {
    color: Palette.white,
    fontWeight: '600',
  },
  chipCount: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chipCountActive: {
    color: Palette.white,
  },
});
