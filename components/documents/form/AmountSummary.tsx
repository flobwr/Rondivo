import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { formatEuro } from '@/constants/format';
import { cardShadow } from '@/constants/shadow';
import { PillSelect } from './PillSelect';
import { SectionLabel } from './SectionLabel';

export const TVA_OPTIONS = [
  { key: '0', label: '0 %' },
  { key: '5.5', label: '5,5 %' },
  { key: '10', label: '10 %' },
  { key: '20', label: '20 %' },
];

type Props = {
  amountHT: number;
  tvaRate: string;
  onChangeTva: (key: string) => void;
};

export function AmountSummary({ amountHT, tvaRate, onChangeTva }: Props) {
  const rate = parseFloat(tvaRate) || 0;
  const tvaAmount = (amountHT * rate) / 100;
  const amountTTC = amountHT + tvaAmount;

  return (
    <View>
      <SectionLabel>Montant</SectionLabel>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Montant HT</Text>
          <Text style={styles.htValue}>{formatEuro(amountHT)}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.tvaBlock}>
          <Text style={styles.rowLabel}>TVA</Text>
          <View style={styles.tvaPills}>
            <PillSelect options={TVA_OPTIONS} value={tvaRate} onChange={onChangeTva} />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.ttcLabel}>Montant TTC</Text>
          <Text style={styles.ttcValue}>{formatEuro(amountTTC)}</Text>
        </View>
      </View>
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  htValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  tvaBlock: {
    paddingVertical: Spacing.md,
    gap: 10,
  },
  tvaPills: {
    marginTop: 2,
  },
  ttcLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  ttcValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.blue,
    letterSpacing: -0.4,
  },
});
