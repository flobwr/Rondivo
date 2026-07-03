import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { DEVIS_STATUS_META, Devis } from '@/data/documents/devis';

export function DevisCard({ devis, onPress }: { devis: Devis; onPress: () => void }) {
  const meta = DEVIS_STATUS_META[devis.status];

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={`Devis de ${devis.clientName}`}>
      <View style={styles.topRow}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail">
          {devis.clientName}
        </Text>
        <Text style={styles.amount}>{formatAmount(devis.amount)}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {devis.number} · Valable jusqu’au {formatShortDate(devis.validUntil)}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 13,
    paddingHorizontal: 16,
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
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: 6,
  },
  meta: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
});
