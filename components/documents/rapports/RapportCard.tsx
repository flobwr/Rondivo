import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { formatShortDate } from '@/data/documents/date-utils';
import { RAPPORT_STATUS_META, Rapport } from '@/data/documents/rapports';

export function RapportCard({ rapport, onPress }: { rapport: Rapport; onPress: () => void }) {
  const meta = RAPPORT_STATUS_META[rapport.status];

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={`Rapport — ${rapport.interventionLabel}`}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {rapport.interventionLabel}
        </Text>
        <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
      </View>

      <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
        {rapport.clientName} · {formatShortDate(rapport.date)}
      </Text>
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
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  meta: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 6,
  },
});
