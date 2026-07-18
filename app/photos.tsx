import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { PhotoInterventionCard } from '@/components/documents/photos/PhotoInterventionCard';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { PHOTO_INTERVENTIONS } from '@/data/documents/photos';

export default function PhotosScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = PHOTO_INTERVENTIONS;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.label.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search]);

  const totalPhotos = useMemo(
    () => PHOTO_INTERVENTIONS.reduce((sum, p) => sum + p.photos.length, 0),
    []
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Photos" onBack={() => router.back()} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher une intervention, un client…" />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <PhotoInterventionCard intervention={item} onPress={() => router.push(`/photos/${item.id}` as never)} />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} intervention{filtered.length > 1 ? 's' : ''} · {totalPhotos} photos
            </Text>
          }
          ListEmptyComponent={
            <EmptyState icon="camera" title="Aucune intervention" subtitle="Aucune intervention ne correspond à votre recherche." />
          }
        />
      </SafeAreaView>

      <BottomDock activeIndex={3} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  separator: {
    height: 8,
  },
}));
