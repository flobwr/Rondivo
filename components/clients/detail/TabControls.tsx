import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';
import { PressableScale } from './primitives';

// Search field shared by the Interventions and Documents tabs.
export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Feather name="search" size={16} color={Palette.textTertiary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textTertiary}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <PressableScale onPress={() => onChangeText('')} to={0.9} haptic={false} accessibilityLabel="Effacer">
          <Feather name="x" size={16} color={Palette.textTertiary} />
        </PressableScale>
      ) : null}
    </View>
  );
}

// Single-select filter chips.
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
      keyboardShouldPersistTaps="handled">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <PressableScale
            key={option.key}
            onPress={() => onChange(option.key)}
            to={0.95}
            haptic={false}
            style={StyleSheet.flatten([styles.chip, active && styles.chipActive])}
            accessibilityLabel={option.label}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  input: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    padding: 0,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: Palette.card,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  chipActive: {
    backgroundColor: Palette.blue,
    borderColor: Palette.blue,
  },
  chipText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  chipTextActive: {
    color: Palette.white,
  },
});
