import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/PressableScale';
import { createThemedStyles, FontSize, iconButtonShadow, Palette, Radius, Spacing } from '@/theme';
import { InterventionPhoto, PHOTO_CATEGORY_LABEL } from '@/services/documents/photos';

type Props = {
  visible: boolean;
  photos: InterventionPhoto[];
  onClose: () => void;
  onAddPhoto: () => void;
};

const COLUMNS = 3;
const GAP = 8;

export function PhotoGalleryModal({ visible, photos, onClose, onAddPhoto }: Props) {
  const [expanded, setExpanded] = useState<InterventionPhoto | null>(null);
  const { width } = useWindowDimensions();
  const tileSize = (width - Spacing.screen * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const handleClose = () => {
    setExpanded(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.flex}>
          <View style={styles.header}>
            <Text style={styles.title}>Photos ({photos.length})</Text>
            <Pressable style={styles.closeButton} onPress={handleClose} hitSlop={8}>
              <Feather name="x" size={20} color={Palette.textPrimary} />
            </Pressable>
          </View>

          {expanded ? (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: expanded.uri }} style={styles.preview} contentFit="contain" />
              <Pressable style={styles.backToGrid} onPress={() => setExpanded(null)} hitSlop={8}>
                <Feather name="chevron-left" size={18} color={Palette.textPrimary} />
                <Text style={styles.backToGridText}>Retour à la grille</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
              {photos.map((photo) => (
                <PressableScale
                  key={photo.id}
                  onPress={() => setExpanded(photo)}
                  to={0.96}
                  style={[styles.tile, { width: tileSize, height: tileSize }]}
                  accessibilityLabel="Agrandir la photo">
                  <Image source={{ uri: photo.uri }} style={styles.tileImage} contentFit="cover" />
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{PHOTO_CATEGORY_LABEL[photo.category]}</Text>
                  </View>
                </PressableScale>
              ))}
            </ScrollView>
          )}

          <View style={styles.footer}>
            <PressableScale onPress={onAddPhoto} to={0.97} style={styles.addButton} accessibilityLabel="Ajouter une photo">
              <Feather name="plus" size={16} color={Palette.white} />
              <Text style={styles.addButtonText}>Ajouter une photo</Text>
            </PressableScale>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.iconButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.lg,
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
  chip: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
    borderRadius: 6,
    paddingVertical: 3,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
  previewWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.screen,
  },
  preview: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Palette.cardMuted,
  },
  backToGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 14,
  },
  backToGridText: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  footer: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Palette.blue,
  },
  addButtonText: {
    color: Palette.white,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
}));
