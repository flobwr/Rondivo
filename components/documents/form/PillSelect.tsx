import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';

type Option = {
  key: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (key: string) => void;
};

/** Row of equal-width single-select pills — validity duration, VAT rate, payment terms… */
export function PillSelect({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
            onPress={() => onChange(option.key)}>
            <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    borderRadius: Radius.tile,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: Palette.blueSoft,
    borderWidth: 1.5,
    borderColor: Palette.blue,
  },
  pillInactive: {
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  labelActive: {
    color: Palette.blue,
  },
});
