import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { NextActionBanner } from '@/components/documents/shared/NextActionBanner';
import { PressableScale } from '@/components/documents/shared/primitives';
import { PhotoLightbox } from '@/components/documents/photos/PhotoLightbox';
import { PhotoSourceSheet } from '@/components/documents/photos/PhotoSourceSheet';
import { pickFromCamera, pickFromLibrary } from '@/utils/photo-picker';
import { FontSize, iconButtonShadow, Palette, Radius, Spacing } from '@/theme';
import { formatLongDate } from '@/data/documents/date-utils';
import {
  InterventionPhoto,
  PHOTO_CATEGORY_LABEL,
  PHOTO_CATEGORY_META,
  PHOTO_CATEGORY_ORDER,
  PHOTO_INTERVENTIONS,
  PhotoCategory,
  photoCategoryCounts,
} from '@/data/documents/photos';
import { MOCK_RAPPORTS } from '@/data/documents/rapports';
import { addInterventionPhoto, removeInterventionPhoto, updateInterventionPhotoCategory } from '@/services/documents/photos';

const GAP = 6;
const COLUMNS = 3;

export default function PhotoInterventionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const source = useMemo(() => PHOTO_INTERVENTIONS.find((p) => p.id === id), [id]);

  const [photos, setPhotos] = useState<InterventionPhoto[]>(source?.photos ?? []);
  const [category, setCategory] = useState<PhotoCategory | null>(null);
  const [viewerPhoto, setViewerPhoto] = useState<InterventionPhoto | null>(null);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<PhotoCategory | null>(null);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);

  const tileSize = (width - Spacing.screen * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  if (!source) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Photos" onBack={() => router.back()} />
          <Text style={styles.notFound}>Intervention introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const intervention = { ...source, photos };
  const counts = photoCategoryCounts(intervention);
  const linkedRapport = MOCK_RAPPORTS.find((r) => r.interventionId === intervention.id);

  const filtered = category ? photos.filter((p) => p.category === category) : photos;

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Toutes', count: photos.length, color: Palette.blue },
    ...PHOTO_CATEGORY_ORDER.map((c) => ({
      key: c,
      label: PHOTO_CATEGORY_LABEL[c],
      count: counts[c],
      color: PHOTO_CATEGORY_META[c].color,
    })),
  ];

  const categoryMenuItems: ActionSheetItem[] = PHOTO_CATEGORY_ORDER.map((c) => ({
    key: c,
    icon: 'camera' as const,
    label: PHOTO_CATEGORY_LABEL[c],
    onPress: () => {
      setPendingCategory(c);
      setSourceSheetOpen(true);
    },
  }));

  const handlePickCamera = async () => {
    setSourceSheetOpen(false);
    const uri = await pickFromCamera();
    if (uri && pendingCategory) {
      const photo = await addInterventionPhoto(intervention.id, { uri, category: pendingCategory });
      if (photo) setPhotos((prev) => [...prev, photo]);
    }
  };

  const handlePickLibrary = async () => {
    setSourceSheetOpen(false);
    const uri = await pickFromLibrary();
    if (uri && pendingCategory) {
      const photo = await addInterventionPhoto(intervention.id, { uri, category: pendingCategory });
      if (photo) setPhotos((prev) => [...prev, photo]);
    }
  };

  const handleDeletePhoto = (photo: InterventionPhoto) => {
    setViewerPhoto(null);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    removeInterventionPhoto(intervention.id, photo.id);
  };

  const handleChangeCategory = (photo: InterventionPhoto) => {
    const index = PHOTO_CATEGORY_ORDER.indexOf(photo.category);
    const next = PHOTO_CATEGORY_ORDER[(index + 1) % PHOTO_CATEGORY_ORDER.length];
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, category: next } : p)));
    setViewerPhoto((prev) => (prev ? { ...prev, category: next } : prev));
    updateInterventionPhotoCategory(intervention.id, photo.id, next);
  };

  const handleGenerateReport = () => {
    if (linkedRapport) {
      router.push(`/rapport/${linkedRapport.id}` as never);
      return;
    }
    router.push(`/rapport/new?interventionId=${intervention.id}` as never);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCategoryMenuOpen(true);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={intervention.label} onBack={() => router.back()} />

        <PressableScale
          onPress={() => router.push(`/client/${intervention.clientId}` as never)}
          to={0.98}
          style={styles.clientRow}
          accessibilityLabel="Ouvrir la fiche client">
          <Text style={styles.clientName}>{intervention.clientName}</Text>
          <Text style={styles.clientDate}>{formatLongDate(intervention.date)}</Text>
        </PressableScale>

        <View style={styles.reportButtonWrap}>
          <NextActionBanner
            label={linkedRapport ? 'Ouvrir le rapport' : 'Créer un rapport'}
            icon={linkedRapport ? 'arrow-right' : 'clipboard'}
            onPress={handleGenerateReport}
          />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={category} onSelect={(k) => setCategory(k as PhotoCategory | null)} />
        </View>

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
                <View style={[styles.tileChipDot, { backgroundColor: PHOTO_CATEGORY_META[item.category].color }]} />
                <Text style={styles.tileChipText}>{PHOTO_CATEGORY_LABEL[item.category]}</Text>
              </View>
            </PressableScale>
          )}
          ListEmptyComponent={
            <EmptyState icon="camera" title="Aucune photo" subtitle="Aucune photo ne correspond à ces filtres." />
          }
        />

        <PressableScale onPress={handleAddPress} to={0.92} style={styles.fab} accessibilityLabel="Ajouter une photo">
          <View style={styles.fabInner}>
            <Text style={styles.fabIcon}>＋</Text>
          </View>
        </PressableScale>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu
        visible={categoryMenuOpen}
        title="Ajouter une photo — quelle phase ?"
        items={categoryMenuItems}
        onClose={() => setCategoryMenuOpen(false)}
      />

      <PhotoSourceSheet
        visible={sourceSheetOpen}
        onClose={() => setSourceSheetOpen(false)}
        onPickCamera={handlePickCamera}
        onPickLibrary={handlePickLibrary}
      />

      <PhotoLightbox
        photo={viewerPhoto}
        onClose={() => setViewerPhoto(null)}
        onDelete={handleDeletePhoto}
        onChangeCategory={handleChangeCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  clientName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.2,
  },
  clientDate: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  reportButtonWrap: {
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  chipsWrap: {
    marginBottom: Spacing.sm,
  },
  grid: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
    flexGrow: 1,
  },
  tile: {
    borderRadius: Radius.tile,
    overflow: 'hidden',
    backgroundColor: Palette.cardMuted,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileChip: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
  },
  tileChipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  tileChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
  fab: {
    position: 'absolute',
    right: Spacing.screen,
    bottom: 20,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  fabIcon: {
    fontSize: 26,
    fontWeight: '400',
    color: Palette.white,
    marginTop: -2,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
});
