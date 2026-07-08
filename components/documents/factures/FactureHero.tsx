import { StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { formatAmount, formatLongDate } from '@/data/documents/date-utils';
import { FACTURE_STATUS_META, Facture } from '@/data/documents/factures';

export function FactureHero({ facture, onOpenClient }: { facture: Facture; onOpenClient: () => void }) {
  const meta = FACTURE_STATUS_META[facture.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <PressableScale onPress={onOpenClient} to={0.98} accessibilityLabel={`Ouvrir la fiche de ${facture.clientName}`}>
          <Text style={styles.client} numberOfLines={1} maxFontSizeMultiplier={1.3}>
            {facture.clientName}
          </Text>
        </PressableScale>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <Text style={styles.amount} maxFontSizeMultiplier={1.3}>{formatAmount(facture.amount)}</Text>

      <View style={styles.datesRow}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Émise le</Text>
          <Text style={styles.dateValue}>{formatLongDate(facture.issuedAt)}</Text>
        </View>
        <View style={styles.dateDivider} />
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Échéance</Text>
          <Text style={styles.dateValue}>{formatLongDate(facture.dueAt)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg + 2,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    maxWidth: 200,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -1,
    marginTop: 14,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  dateBlock: {
    flex: 1,
  },
  dateDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: Palette.border,
    marginHorizontal: Spacing.md,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  dateValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
});
