import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';
import { formatEuroShort, type ClientDetail } from '@/data/client-details';
import { SectionCard } from './primitives';

type Props = {
  detail: ClientDetail;
  onSeeAll: () => void;
};

function StatTile({ value, label, valueColor }: { value: string; label: string; valueColor?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

// The four numbers an artisan actually glances at. Everything else lives behind
// "Voir toutes les statistiques".
export function QuickStatsCard({ detail, onSeeAll }: Props) {
  const s = detail.stats['12m'];
  return (
    <SectionCard
      icon="trending-up"
      iconTint="green"
      title="Statistiques"
      footerLabel="Voir toutes les statistiques"
      onFooterPress={onSeeAll}>
      <View style={styles.grid}>
        <StatTile value={formatEuroShort(s.revenue)} label="Chiffre d'affaires" />
        <StatTile
          value={formatEuroShort(s.totalUnpaid)}
          label="Impayés"
          valueColor={s.totalUnpaid > 0 ? Palette.red : Palette.green}
        />
        <StatTile value={`${s.interventions}`} label="Interventions" />
        <StatTile value={s.lastIntervention} label="Dernière intervention" />
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 4,
    letterSpacing: -0.1,
  },
});
