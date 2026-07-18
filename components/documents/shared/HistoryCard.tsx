import { StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, Palette } from '@/theme';
import { FeatherIconName } from '../types';
import { IconTile, SectionCard } from './primitives';

export type HistoryEntry = {
  id: string;
  icon: FeatherIconName;
  label: string;
  date: string; // already formatted for display
};

export function HistoryCard({ entries }: { entries: HistoryEntry[] }) {
  return (
    <SectionCard icon="clock" title="Historique">
      <View>
        {entries.map((entry, index) => (
          <View key={entry.id} style={styles.row}>
            <View style={styles.rail}>
              <IconTile icon={entry.icon} color={Palette.blue} soft={Palette.blueSoft} size={28} iconSize={13} />
              {index < entries.length - 1 ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.label}>{entry.label}</Text>
              <Text style={styles.date}>{entry.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rail: {
    alignItems: 'center',
  },
  line: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 16,
    backgroundColor: Palette.border,
    marginVertical: 3,
  },
  rowContent: {
    flex: 1,
    paddingBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 1,
  },
}));
