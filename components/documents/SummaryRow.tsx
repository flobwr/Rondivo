import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';

type SummaryItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

type Props = {
  items: SummaryItem[];
};

export function SummaryRow({ items }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.label} style={[styles.item, index > 0 && styles.itemBorder]}>
          <Text
            style={[styles.value, item.highlight && styles.valueHighlight]}
            numberOfLines={1}>
            {item.value}
          </Text>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: Palette.border,
  },
  value: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  valueHighlight: {
    color: Palette.red,
  },
  label: {
    fontSize: FontSize.tiny,
    color: Palette.textSecondary,
    marginTop: 2,
  },
});
