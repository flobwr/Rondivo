import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { DocumentsTone } from '@/components/documents/palette';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { daysSince, formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { DEVIS_STATUS_META, Devis } from '@/data/documents/devis';

function expiryLine(devis: Devis): { text: string; tone: 'red' | 'orange' } | null {
  if (devis.status !== 'envoye' && devis.status !== 'vu') return null;
  const daysLeft = -daysSince(devis.validUntil);
  if (daysLeft < 0 || daysLeft > 3) return null;
  const text = daysLeft === 0 ? 'Expire aujourd’hui' : daysLeft === 1 ? 'Expire demain' : `Expire dans ${daysLeft} jours`;
  return { text, tone: daysLeft <= 1 ? 'red' : 'orange' };
}

export function DevisCard({ devis, onPress }: { devis: Devis; onPress: () => void }) {
  const meta = DEVIS_STATUS_META[devis.status];
  const expiry = expiryLine(devis);

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={`Devis de ${devis.clientName}`}>
      <View style={styles.topRow}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail" maxFontSizeMultiplier={1.3}>
          {devis.clientName}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {devis.number} · Valable jusqu’au {formatShortDate(devis.validUntil)}
        </Text>
        <Text style={styles.amount}>{formatAmount(devis.amount)}</Text>
      </View>

      {expiry ? (
        <Text style={[styles.alert, { color: DocumentsTone[expiry.tone].color }]}>{expiry.text}</Text>
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
  alert: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginTop: 5,
  },
});
