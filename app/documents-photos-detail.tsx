import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContextualFAB } from '@/components/documents/ContextualFAB';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { FilterChips, type FilterChip } from '@/components/documents/FilterChips';
import { PHOTO_INTERVENTIONS } from '@/components/documents/mock-data';
import type { InterventionPhoto } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

const PHASE_LABELS = {
  before: 'Avant',
  during: 'Pendant',
  after: 'Après',
} as const;

function PhotoGrid({ photos }: { photos: InterventionPhoto[] }) {
  const thumbColors = ['#CBD5E1', '#94A3B8', '#B0B8C4', '#D1D5DB', '#A8B0BB', '#C4CAD2'];

  return (
    <View style={styles.grid}>
      {photos.map((photo, i) => (
        <Pressable
          key={photo.id}
          style={styles.gridItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}>
          <View
            style={[
              styles.gridPhoto,
              { backgroundColor: thumbColors[i % thumbColors.length] },
            ]}>
            <View style={styles.phaseLabel}>
              <Text style={styles.phaseLabelText}>
                {PHASE_LABELS[photo.phase]}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export default function PhotosDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [filterIndex, setFilterIndex] = useState(0);

  const intervention = PHOTO_INTERVENTIONS.find((pi) => pi.id === id);

  const { filters, filteredPhotos } = useMemo(() => {
    if (!intervention) return { filters: [], filteredPhotos: [] };
    const before = intervention.photos.filter((p) => p.phase === 'before');
    const during = intervention.photos.filter((p) => p.phase === 'during');
    const after = intervention.photos.filter((p) => p.phase === 'after');

    const chips: FilterChip[] = [
      { label: 'Toutes', count: intervention.photos.length },
      { label: 'Avant', count: before.length, dotColor: Palette.blue },
      { label: 'Pendant', count: during.length, dotColor: Palette.orange },
      { label: 'Après', count: after.length, dotColor: Palette.green },
    ];

    const phase = ['all', 'before', 'during', 'after'][filterIndex];
    const photos =
      phase === 'all'
        ? intervention.photos
        : intervention.photos.filter((p) => p.phase === phase);

    return { filters: chips, filteredPhotos: photos };
  }, [intervention, filterIndex]);

  if (!intervention) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DocumentHeader title="Photos" />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Intervention introuvable</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title={intervention.title} />

        <View style={styles.interventionInfo}>
          <Text style={styles.interventionClient}>
            {intervention.client} · {intervention.date}
          </Text>
        </View>

        <FilterChips
          chips={filters}
          selectedIndex={filterIndex}
          onSelect={setFilterIndex}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <PhotoGrid photos={filteredPhotos} />
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Ajouter des photos" icon="camera" />

      <View style={styles.pdfButtonWrapper} pointerEvents="box-none">
        <Pressable
          style={styles.pdfButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}>
          <Feather name="file" size={16} color={Palette.textPrimary} />
          <Text style={styles.pdfButtonText}>Générer le rapport PDF</Text>
        </Pressable>
      </View>
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
  interventionInfo: {
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.lg,
  },
  interventionClient: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 140,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '31%',
    flexGrow: 1,
    maxWidth: '33%',
  },
  gridPhoto: {
    aspectRatio: 1,
    borderRadius: Radius.tile,
    justifyContent: 'flex-end',
    padding: 6,
  },
  phaseLabel: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  phaseLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.body,
    color: Palette.textSecondary,
  },
  pdfButtonWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  pdfButtonText: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
});
