import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow, cardShadow } from '@/constants/shadow';

export type ToolbarChip = {
  key: string;
  label: string;
  count: number;
};

type Props = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  chips: ToolbarChip[];
  selectedChip: string;
  onSelectChip: (key: string) => void;
  resultLabel: string;
  sortLabel: string;
  onToggleSort: () => void;
};

export function ListToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  chips,
  selectedChip,
  onSelectChip,
  resultLabel,
  sortLabel,
  onToggleSort,
}: Props) {
  return (
    <View>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Palette.textTertiary} />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={Palette.textTertiary}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.filterButton} hitSlop={6}>
          <Feather name="filter" size={18} color={Palette.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        {chips.map((chip) => {
          const active = chip.key === selectedChip;
          return (
            <Pressable
              key={chip.key}
              style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              onPress={() => onSelectChip(chip.key)}>
              <Text style={[styles.chipLabel, active ? styles.chipLabelActive : null]}>
                {chip.label}
              </Text>
              <Text style={[styles.chipCount, active ? styles.chipCountActive : null]}>
                {chip.count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.metaRow}>
        <Text style={styles.resultLabel}>{resultLabel}</Text>
        <Pressable style={styles.sortButton} onPress={onToggleSort} hitSlop={6}>
          <Feather name="sliders" size={13} color={Palette.textSecondary} />
          <Text style={styles.sortLabel}>{sortLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    height: 48,
    ...cardShadow,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.label,
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
    paddingRight: Spacing.screen,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    ...actionShadow,
  },
  chipActive: {
    backgroundColor: Palette.blue,
  },
  chipInactive: {
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  chipLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  chipLabelActive: {
    color: Palette.white,
  },
  chipCount: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.textTertiary,
  },
  chipCountActive: {
    color: 'rgba(255,255,255,0.75)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  resultLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
});
