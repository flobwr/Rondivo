import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  chevron?: boolean;
  children?: React.ReactNode;
};

/** One labeled field inside a FormCard — either a display/picker row or a custom input via children. */
export function FormRow({ label, value, placeholder, onPress, chevron = true, children }: Props) {
  const content = children ?? (
    <Text style={value ? styles.value : styles.placeholder} numberOfLines={1}>
      {value ?? placeholder}
    </Text>
  );

  if (onPress) {
    return (
      <Pressable style={styles.row} onPress={onPress}>
        <View style={styles.textCol}>
          <Text style={styles.label}>{label}</Text>
          {content}
        </View>
        {chevron ? <Feather name="chevron-right" size={19} color={Palette.textTertiary} /> : null}
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  placeholder: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
});
