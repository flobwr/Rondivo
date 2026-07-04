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
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {rapport.interventionLabel}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {rapport.clientName} · {formatShortDate(rapport.date)}
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
    paddingVertical: 11,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
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
});
