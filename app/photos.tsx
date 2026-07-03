import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { PressableScale } from '@/components/documents/shared/primitives';
import { PhotoViewerModal } from '@/components/documents/photos/PhotoViewerModal';
import { Palette, Spacing } from '@/constants/design';
import { DocPhoto, MOCK_PHOTOS, PHOTO_CATEGORY_LABEL, PhotoCategory, uniqueClientsInPhotos } from '@/data/documents/photos';

const GAP = 8;
const COLUMNS = 3;

export default function PhotosScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tileSize = (width - Spacing.screen * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [category, setCategory] = useState<PhotoCategory | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const [viewerPhoto, setViewerPhoto] = useState<DocPhoto | null>(null);

  const clients = useMemo(() => uniqueClientsInPhotos(), []);

  const filtered = useMemo(() => {
    let list = photos;
    if (category) list = list.filter((p) => p.category === category);
    if (clientId) list = list.filter((p) => p.clientId === clientId);
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [photos, category, clientId]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Toutes', count: photos.length, color: Palette.blue },
    ...(['avant', 'pendant', 'apres'] as PhotoCategory[]).map((c) => ({
      key: c,
      label: PHOTO_CATEGORY_LABEL[c],
      count: photos.filter((p) => p.category === c).length,
      color: Palette.blue,
    })),
  ];

  const clientMenuItems: ActionSheetItem[] = [
    { key: 'all', icon: 'users', label: 'Tous les clients', onPress: () => setClientId(null) },
    ...clients.map((c) => ({
      key: c.id,
      icon: 'user' as const,
      label: c.name,
      onPress: () => setClientId(c.id),
    })),
  ];

  const activeClientName = clientId ? clients.find((c) => c.id === clientId)?.name : null;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Photos" onBack={() => router.back()} onMenu={() => setClientMenuOpen(true)} />

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={category} onSelect={(k) => setCategory(k as PhotoCategory | null)} />
        </View>

        {activeClientName ? (
          <PressableScale onPress={() => setClientId(null)} to={0.97} style={styles.activeClientPill} accessibilityLabel="Retirer le filtre client">
            <Text style={styles.activeClientText}>{activeClientName} ✕</Text>
          </PressableScale>
        ) : null}

        <FlatList
          data={filtered}
          key={COLUMNS}
          keyExtractor={(p) => p.id}
          numColumns={COLUMNS}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          renderItem={({ item }) => (
            <PressableScale
              onPress={() => setViewerPhoto(item)}
              to={0.96}
              style={[styles.tile, { width: tileSize, height: tileSize }]}
              accessibilityLabel="Agrandir la photo">
              <Image source={{ uri: item.uri }} style={styles.tileImage} contentFit="cover" />
              <View style={styles.tileChip}>
                <Text style={styles.tileChipText}>{PHOTO_CATEGORY_LABEL[item.category]}</Text>
              </View>
            </PressableScale>
          )}
          ListEmptyComponent={
            <EmptyState icon="camera" title="Aucune photo" subtitle="Aucune photo ne correspond à ces filtres." />
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu
        visible={clientMenuOpen}
        title="Filtrer par client"
        items={clientMenuItems}
        onClose={() => setClientMenuOpen(false)}
      />

      <PhotoViewerModal
        photo={viewerPhoto}
        onClose={() => setViewerPhoto(null)}
        onOpenIntervention={(photo) => {
          setViewerPhoto(null);
          router.push(`/intervention/${photo.interventionId}`);
        }}
        onDelete={(photo) => {
          setViewerPhoto(null);
          setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  chipsWrap: {
    marginBottom: Spacing.sm,
  },
  activeClientPill: {
    alignSelf: 'flex-start',
    marginLeft: Spacing.screen,
    marginBottom: Spacing.sm,
    backgroundColor: Palette.blueSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeClientText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.blue,
  },
  grid: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  tile: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Palette.cardMuted,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileChip: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
    borderRadius: 6,
    paddingVertical: 3,
    alignItems: 'center',
  },
  tileChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
});
