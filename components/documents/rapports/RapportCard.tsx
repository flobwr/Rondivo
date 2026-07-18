import { StyleSheet, Text, View } from 'react-native';

import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { DocumentsTone } from '@/components/documents/palette';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { daysSince, formatShortDate } from '@/data/documents/date-utils';
import { RAPPORT_STATUS_META, Rapport } from '@/data/documents/rapports';

function dueLine(rapport: Rapport): { text: string; tone: 'red' | 'orange' } | null {
  if (rapport.status !== 'aCompleter' && rapport.status !== 'enCours') return null;
  const days = daysSince(rapport.date);
  if (days < 0) return null;
  if (days === 0) return { text: 'À terminer aujourd’hui', tone: 'orange' };
  return { text: `À terminer depuis ${days} jour${days > 1 ? 's' : ''}`, tone: 'red' };
}

export function RapportCard({ rapport, onPress }: { rapport: Rapport; onPress: () => void }) {
  const meta = RAPPORT_STATUS_META[rapport.status];
  const due = dueLine(rapport);

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={`Rapport — ${rapport.interventionLabel}`}>
      <View style={styles.topRow}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail" maxFontSizeMultiplier={1.3}>
          {rapport.clientName}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {rapport.interventionLabel} · {formatShortDate(rapport.date)}
        </Text>
      </View>

      {due ? <Text style={[styles.alert, { color: DocumentsTone[due.tone].color }]}>{due.text}</Text> : null}
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
