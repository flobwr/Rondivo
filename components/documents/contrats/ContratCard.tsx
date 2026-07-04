import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { formatShortDate } from '@/data/documents/date-utils';
import { CONTRAT_STATUS_META, Contrat } from '@/data/documents/contrats';

export function ContratCard({ contrat, onPress }: { contrat: Contrat; onPress: () => void }) {
  const meta = CONTRAT_STATUS_META[contrat.status];

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={contrat.title}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {contrat.title}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {contrat.clientName} · Depuis le {formatShortDate(contrat.startDate)}
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
    letterSpacing: -0.2,
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
