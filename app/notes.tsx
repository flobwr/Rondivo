import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { IconTile } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { Note, NOTES } from '@/data/notes';

function NoteRow({ note }: { note: Note }) {
  return (
    <View style={styles.row}>
      <IconTile icon="file-text" color={Palette.purple} soft={Palette.purpleSoft} size={38} iconSize={16} radius={12} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2} ellipsizeMode="tail">
          {note.preview}
        </Text>
      </View>
      <Text style={styles.date}>{note.dateLabel}</Text>
    </View>
  );
}

export default function NotesScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Notes" onBack={() => router.back()} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {NOTES.length > 0 ? (
            <View style={styles.card}>
              {NOTES.map((note, index) => (
                <View key={note.id}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <NoteRow note={note} />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState icon="file-text" title="Aucune note" subtitle="Vos notes et pense-bêtes apparaîtront ici." />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.separator,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  preview: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  date: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
