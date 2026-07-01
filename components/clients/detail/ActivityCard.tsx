import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS, type FeatherIconName, type Tint } from '@/components/clients/types';
import { FontSize, Palette } from '@/constants/design';
import { type ActivityEntry, type ActivityKind } from '@/data/client-details';
import { SectionCard } from './primitives';

type Props = {
  activity: ActivityEntry[];
  onSeeAll: () => void;
  limit?: number;
};

const KIND_META: Record<ActivityKind, { icon: FeatherIconName; tint: Tint }> = {
  intervention: { icon: 'check-circle', tint: 'green' },
  devis: { icon: 'file-text', tint: 'orange' },
  facture: { icon: 'credit-card', tint: 'red' },
  paiement: { icon: 'dollar-sign', tint: 'green' },
  sms: { icon: 'message-square', tint: 'blue' },
  appel: { icon: 'phone', tint: 'blue' },
  note: { icon: 'edit-3', tint: 'purple' },
  client: { icon: 'user-plus', tint: 'blue' },
};

function TimelineRow({ entry, isLast }: { entry: ActivityEntry; isLast: boolean }) {
  const meta = KIND_META[entry.kind];
  const { color, soft } = TINT_COLORS[meta.tint];
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.node, { backgroundColor: soft }]}>
          <Feather name={meta.icon} size={15} color={color} />
        </View>
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={[styles.content, isLast && styles.contentLast]}>
        <Text style={styles.title}>{entry.title}</Text>
        {entry.subtitle ? <Text style={styles.subtitle}>{entry.subtitle}</Text> : null}
        <Text style={styles.date}>
          {entry.date} à {entry.time}
        </Text>
      </View>
    </View>
  );
}

export function ActivityCard({ activity, onSeeAll, limit = 4 }: Props) {
  const items = activity.slice(0, limit);
  return (
    <SectionCard
      icon="clock"
      iconTint="blue"
      title="Activité"
      footerLabel="Voir toute l'activité"
      onFooterPress={onSeeAll}>
      {items.map((entry, index) => (
        <TimelineRow key={entry.id} entry={entry} isLast={index === items.length - 1} />
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rail: {
    alignItems: 'center',
    width: 32,
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Palette.border,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 18,
  },
  contentLast: {
    paddingBottom: 0,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 3,
  },
});
