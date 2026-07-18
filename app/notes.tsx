import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { PressableScale, IconTile } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useAsyncList } from '@/hooks/use-async-list';
import { formatNoteDate, listNotes, Note } from '@/services/notes';

function NoteRow({ note, onPress }: { note: Note; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.985} style={styles.row} accessibilityLabel={note.title}>
      <IconTile icon="file-text" color={Palette.purple} soft={Palette.purpleSoft} size={38} iconSize={16} radius={12} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {note.title}
        </Text>
        {note.content ? (
          <Text style={styles.preview} numberOfLines={2} ellipsizeMode="tail">
            {note.content}
          </Text>
        ) : null}
      </View>
      <Text style={styles.date}>{formatNoteDate(note.updatedAt)}</Text>
    </PressableScale>
  );
}

export default function NotesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const fetchNotes = useCallback(() => listNotes(), []);
  const { data: allNotes, status, refresh } = useAsyncList<Note>(fetchNotes);

  const notes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? allNotes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      : allNotes;
    return [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [search, allNotes]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Notes" onBack={() => router.back()} onAdd={() => router.push('/note/new')} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher une note…" />

          {status === 'loading' ? (
            <View style={{ gap: Spacing.lg }}>
              <SkeletonBlock height={72} radius={24} />
              <SkeletonBlock height={72} radius={24} />
              <SkeletonBlock height={72} radius={24} />
            </View>
          ) : status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : notes.length > 0 ? (
            <View style={styles.card}>
              {notes.map((note, index) => (
                <View key={note.id}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <NoteRow note={note} onPress={() => router.push({ pathname: '/note/new', params: { editId: note.id } })} />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="file-text"
              title={search ? 'Aucun résultat' : 'Aucune note'}
              subtitle={search ? 'Aucune note ne correspond à votre recherche.' : 'Vos notes et pense-bêtes apparaîtront ici.'}
              actionLabel={search ? undefined : 'Créer une note'}
              onAction={search ? undefined : () => router.push('/note/new')}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={-1} />
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
    gap: Spacing.lg,
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
