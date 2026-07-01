import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

type Props = {
  notes: string[];
  onSeeMore: () => void;
};

const PREVIEW_COUNT = 2;

// Compact glance at the notes. Shows the star header + up to two lines, then a
// "Voir plus" that hands off to the full Notes tab for editing.
export function NotesPreviewCard({ notes, onSeeMore }: Props) {
  const preview = notes.slice(0, PREVIEW_COUNT);
  const remaining = notes.length - preview.length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <Feather name="star" size={14} color={Palette.orange} />
        </View>
        <Text style={styles.title}>Notes importantes</Text>
      </View>

      {preview.length === 0 ? (
        <PressableScale onPress={onSeeMore} to={0.98} style={styles.addRow} accessibilityLabel="Ajouter une note">
          <Text style={styles.addText}>Ajouter une note…</Text>
        </PressableScale>
      ) : (
        <View style={styles.list}>
          {preview.map((note, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.note} numberOfLines={1}>
                {note}
              </Text>
            </View>
          ))}
        </View>
      )}

      {notes.length > 0 ? (
        <PressableScale onPress={onSeeMore} to={0.96} style={styles.seeMore} accessibilityLabel="Voir toutes les notes">
          <Text style={styles.seeMoreText}>
            {remaining > 0 ? `Voir plus (+${remaining})` : 'Voir plus'}
          </Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.orangeSoft,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconTile: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  list: {
    marginTop: 12,
    gap: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Palette.orange,
  },
  note: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  seeMore: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.orange,
  },
  addRow: {
    marginTop: 10,
  },
  addText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
});
