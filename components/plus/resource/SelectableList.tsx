import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export type SelectableOption<T extends string | number> = {
  key: T;
  label: string;
  description?: string;
  accent?: string;
};

/**
 * An immediate-apply option list. Pass a single value for "choose one" (TVA,
 * Apparence, Langue, template pickers) or an array for "choose several"
 * (Paiements) — tap toggles/selects immediately, no separate save.
 */
export function SelectableList<T extends string | number>({
  options,
  selected,
  onSelect,
}: {
  options: SelectableOption<T>[];
  selected: T | T[];
  onSelect: (key: T) => void;
}) {
  const isSelected = (key: T) => (Array.isArray(selected) ? selected.includes(key) : selected === key);

  return (
    <View style={styles.card}>
      {options.map((option, index) => (
        <View key={option.key}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <PressableScale onPress={() => onSelect(option.key)} to={0.98} style={styles.row} accessibilityLabel={option.label}>
            {option.accent ? <View style={[styles.dot, { backgroundColor: option.accent }]} /> : null}
            <View style={styles.content}>
              <Text style={styles.label}>{option.label}</Text>
              {option.description ? <Text style={styles.description}>{option.description}</Text> : null}
            </View>
            {isSelected(option.key) ? <Feather name="check" size={18} color={Palette.blue} /> : null}
          </PressableScale>
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
    gap: Spacing.sm + 2,
    paddingVertical: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
    opacity: 0.82,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.separator,
  },
});
