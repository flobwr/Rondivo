import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { FontSize, Palette, Radius } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { HistoryEntry } from './types';

type Props = {
  history: HistoryEntry[];
};

function buildMetaLine(entry: HistoryEntry): string | null {
  const parts = [entry.technician, entry.durationLabel, entry.amountLabel, entry.photoCount ? `${entry.photoCount} photos` : null].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join(' · ') : null;
}

export function HistoryCard({ history }: Props) {
  if (history.length === 0) {
    return (
      <SectionCard>
        <Text style={styles.empty}>Aucune intervention précédente chez ce client.</Text>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <View>
        {history.map((entry, index) => {
          const metaLine = buildMetaLine(entry);
          return (
            <View key={entry.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <PressableScale onPress={() => {}} to={0.98} style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.type} numberOfLines={2}>
                    {entry.type}
                  </Text>
                  <Text style={styles.date}>{entry.date}</Text>
                  {metaLine ? (
                    <Text style={styles.meta} numberOfLines={1}>
                      {metaLine}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{entry.status}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={Palette.textTertiary} />
              </PressableScale>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 10,
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 3,
  },
  statusPill: {
    backgroundColor: Palette.greenSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.green,
  },
  empty: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    paddingVertical: 4,
  },
});
