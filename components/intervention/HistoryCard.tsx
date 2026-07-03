import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { HistoryEntry } from './types';

type Props = {
  history: HistoryEntry[];
};

export function HistoryCard({ history }: Props) {
  return (
    <SectionCard icon="rotate-ccw" iconColor={Palette.textSecondary} iconBackground={Palette.cardMuted} title="Historique">
      {history.length > 0 ? (
        <View>
          {history.map((entry, index) => (
            <View key={entry.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <Pressable style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.type} numberOfLines={1}>
                    {entry.type}
                  </Text>
                  <Text style={styles.date}>{entry.date}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{entry.status}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={Palette.textTertiary} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>Aucune intervention précédente chez ce client.</Text>
      )}
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
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
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
