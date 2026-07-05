import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { daysSince, formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { FACTURE_STATUS_META, Facture, PAYMENT_METHOD_LABEL } from '@/data/documents/factures';

export function FactureCard({ facture, onPress }: { facture: Facture; onPress: () => void }) {
  const meta = FACTURE_STATUS_META[facture.status];
  const overdueDays = facture.status === 'enRetard' ? daysSince(facture.dueAt) : 0;

  const metaLine =
    facture.status === 'payee' && facture.method
      ? `${facture.number} · ${PAYMENT_METHOD_LABEL[facture.method]}`
      : `${facture.number} · Échéance ${formatShortDate(facture.dueAt)}`;

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={`Facture de ${facture.clientName}`}>
      <View style={styles.topRow}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail">
          {facture.clientName}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {metaLine}
        </Text>
        <Text style={styles.amount}>{formatAmount(facture.amount)}</Text>
      </View>

      {overdueDays > 0 ? (
        <Text style={styles.overdue}>
          Échue depuis {overdueDays} jour{overdueDays > 1 ? 's' : ''}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 9,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  client: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: 5,
  },
  meta: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  overdue: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.red,
    letterSpacing: -0.1,
    marginTop: 5,
  },
});
