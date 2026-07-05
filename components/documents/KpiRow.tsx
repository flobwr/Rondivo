import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

export type KpiItem = {
  label: string;
  value: string;
  color?: string;
};

type Props = {
  items: KpiItem[];
};

/** Row of compact, low-height KPI tiles shown above a document list. */
export function KpiRow({ items }: Props) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {item.label}
          </Text>
          <Text
            style={[styles.value, item.color ? { color: item.color } : null]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
    ...actionShadow,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
});
