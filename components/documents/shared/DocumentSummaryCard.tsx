import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { formatAmount } from '@/data/documents/date-utils';
import { IconTile } from './primitives';

// The "receipt" recap shown just before the submit button — reassures the
// artisan of exactly what they're about to create without adding a step.
export function DocumentSummaryCard({
  clientName,
  lineCount,
  subtotal,
  vat,
  vatRate,
  total,
  dateLabel,
  dateValue,
}: {
  clientName?: string;
  lineCount: number;
  subtotal: number;
  vat: number;
  vatRate: number;
  total: number;
  dateLabel: string;
  dateValue: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <IconTile icon="check-circle" color={Palette.blue} soft={Palette.blueSoft} size={22} iconSize={12} radius={7} />
        <Text style={styles.title}>Résumé</Text>
      </View>

      <Row label="Client" value={clientName ?? '—'} />
      <Row label="Lignes" value={`${lineCount} ligne${lineCount > 1 ? 's' : ''}`} />
      <Row label="Sous-total" value={formatAmount(subtotal)} />
      <Row label={`TVA (${vatRate}%)`} value={formatAmount(vat)} />
      <Row label={dateLabel} value={dateValue} />

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total TTC</Text>
        <Text style={styles.totalValue}>{formatAmount(total)}</Text>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: FontSize.cardLabel,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowLabel: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  rowValue: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    marginLeft: Spacing.md,
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.blue,
    letterSpacing: -0.3,
  },
});
