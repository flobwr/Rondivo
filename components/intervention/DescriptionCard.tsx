import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { Priority } from './types';

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; background: string }> = {
  basse: { label: 'Priorité basse', color: Palette.textSecondary, background: Palette.cardMuted },
  normale: { label: 'Priorité normale', color: Palette.blue, background: Palette.blueSoft },
  haute: { label: 'Priorité haute', color: Palette.orange, background: Palette.orangeSoft },
};

type Props = {
  description: string;
  notes: string[];
  priority: Priority;
};

export function DescriptionCard({ description, notes, priority }: Props) {
  const p = PRIORITY_CONFIG[priority];

  return (
    <SectionCard
      icon="file-text"
      iconColor={Palette.purple}
      iconBackground={Palette.purpleSoft}
      title="Description"
      right={
        <View style={[styles.priorityPill, { backgroundColor: p.background }]}>
          <Text style={[styles.priorityText, { color: p.color }]} numberOfLines={1}>
            {p.label}
          </Text>
        </View>
      }>
      <Text style={styles.description}>{description}</Text>

      {notes.length > 0 ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>Notes importantes</Text>
          <View style={styles.notesList}>
            {notes.map((note, index) => (
              <View key={index} style={styles.noteRow}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  priorityPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 1,
  },
  priorityText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  description: {
    fontSize: FontSize.label,
    fontWeight: '400',
    color: Palette.textSecondary,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
  notesBox: {
    backgroundColor: Palette.orangeSoft,
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  notesTitle: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Palette.orange,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  notesList: {
    gap: 6,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.orange,
    marginTop: 7,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textPrimary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
});
