import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { DocumentsTone } from '@/components/documents/palette';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { daysSince, formatShortDate } from '@/data/documents/date-utils';
import { CONTRAT_STATUS_META, Contrat } from '@/data/documents/contrats';

const EXPIRING_SOON_WITHIN_DAYS = 14;

function expiryLine(contrat: Contrat): { text: string; tone: 'red' | 'orange' } | null {
  if (contrat.status !== 'signe' || !contrat.endDate) return null;
  const daysLeft = -daysSince(contrat.endDate);
  if (daysLeft < 0 || daysLeft > EXPIRING_SOON_WITHIN_DAYS) return null;
  const text = daysLeft === 0 ? 'Expire aujourd’hui' : daysLeft === 1 ? 'Expire demain' : `Expire dans ${daysLeft} jours`;
  return { text, tone: daysLeft <= 3 ? 'red' : 'orange' };
}

export function ContratCard({ contrat, onPress }: { contrat: Contrat; onPress: () => void }) {
  const meta = CONTRAT_STATUS_META[contrat.status];
  const expiry = expiryLine(contrat);

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={contrat.title}>
      <View style={styles.topRow}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail" maxFontSizeMultiplier={1.3}>
          {contrat.clientName}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {contrat.title} · Depuis le {formatShortDate(contrat.startDate)}
        </Text>
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
