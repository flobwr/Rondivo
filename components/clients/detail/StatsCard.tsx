import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';
import { formatEuro, formatEuroShort, type ClientDetail, type StatsPeriod } from '@/data/client-details';
import { CardSeparator, PressableScale, SectionCard } from './primitives';

type Props = {
  detail: ClientDetail;
};

const PERIODS: { key: StatsPeriod; label: string }[] = [
  { key: '12m', label: '12 derniers mois' },
  { key: 'year', label: 'Cette année' },
  { key: 'all', label: 'Depuis le début' },
];

function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

export function StatsCard({ detail }: Props) {
  const [period, setPeriod] = useState<StatsPeriod>('12m');
  const s = detail.stats[period];

  return (
    <SectionCard icon="trending-up" iconTint="green" title="Statistiques">
      <View style={styles.segment}>
        {PERIODS.map((p) => {
          const active = p.key === period;
          return (
            <PressableScale
              key={p.key}
              onPress={() => setPeriod(p.key)}
              to={0.96}
              haptic={false}
              style={StyleSheet.flatten([styles.segmentItem, active && styles.segmentItemActive])}
              accessibilityLabel={p.label}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
                {p.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <StatRow label="Chiffre d'affaires" value={formatEuroShort(s.revenue)} />
      <CardSeparator />
      <StatRow label="Total payé" value={formatEuroShort(s.totalPaid)} valueColor={Palette.green} />
      <CardSeparator />
      <StatRow
        label="Total impayé"
        value={formatEuroShort(s.totalUnpaid)}
        valueColor={s.totalUnpaid > 0 ? Palette.red : undefined}
      />
      <CardSeparator />
      <StatRow label="Nombre d'interventions" value={`${s.interventions}`} />
      <CardSeparator />
      <StatRow label="Temps moyen d'intervention" value={s.avgInterventionTime} />
      <CardSeparator />
      <StatRow label="Temps moyen de trajet" value={s.avgTravelTime} />
      <CardSeparator />
      <StatRow label="Montant moyen des interventions" value={formatEuro(s.avgAmount)} />
      <CardSeparator />
      <StatRow label="Dernière intervention" value={s.lastIntervention} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    padding: 3,
    marginBottom: 6,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: Palette.card,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
  },
  segmentTextActive: {
    color: Palette.blue,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  statValue: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
});
