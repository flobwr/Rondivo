import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { pickFromCamera, pickFromLibrary } from './photo-picker';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { PhotoPickerSheet } from './PhotoPickerSheet';
import { SectionCard } from './SectionCard';
import { Photo } from './types';

const VISIBLE_COUNT = 2;
const TILE = 92;

function AddTile({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.addTile} onPress={onPress} accessibilityLabel="Ajouter une photo">
      <Feather name="plus" size={22} color={Palette.blue} />
    </Pressable>
  );
}

type Props = {
  photos: Photo[];
  onAddPhoto: (uri: string) => void;
};

export function PhotosCard({ photos, onAddPhoto }: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);

  const openPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickerVisible(true);
  };

  const handlePickCamera = async () => {
    setPickerVisible(false);
    const uri = await pickFromCamera();
    if (uri) onAddPhoto(uri);
    else Alert.alert("Impossible d'accéder à l'appareil photo", "Vérifiez les autorisations de l'application.");
  };

  const handlePickLibrary = async () => {
    setPickerVisible(false);
    const uri = await pickFromLibrary();
    if (uri) onAddPhoto(uri);
  };

  const visiblePhotos = photos.slice(0, VISIBLE_COUNT);
  const hasMore = photos.length > VISIBLE_COUNT;

  return (
    <SectionCard
      icon="camera"
      iconColor={Palette.green}
      iconBackground={Palette.greenSoft}
      title="Photos"
      right={
        hasMore ? (
          <Pressable style={styles.seeAll} onPress={() => setGalleryVisible(true)} hitSlop={6}>
            <Text style={styles.seeAllText}>Voir tout ({photos.length})</Text>
            <Feather name="chevron-right" size={13} color={Palette.blue} />
          </Pressable>
        ) : undefined
      }>
      {photos.length === 0 ? (
        <Pressable style={styles.emptyFrame} onPress={openPicker} accessibilityLabel="Ajouter une photo">
          <View style={styles.emptyIcon}>
            <Feather name="plus" size={26} color={Palette.blue} />
          </View>
          <Text style={styles.emptyText}>Ajouter une photo</Text>
        </Pressable>
      ) : (
        <View style={styles.row}>
          {visiblePhotos.map((photo) => (
            <Pressable
              key={photo.id}
              style={styles.thumb}
              onPress={() => setGalleryVisible(true)}
              accessibilityLabel="Voir la photo">
              <Image source={photo.source} style={styles.thumbImage} contentFit="cover" />
            </Pressable>
          ))}
          <AddTile onPress={openPicker} />
        </View>
      )}

      <PhotoPickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPickCamera={handlePickCamera}
        onPickLibrary={handlePickLibrary}
      />

      <PhotoGalleryModal
        visible={galleryVisible}
        photos={photos}
        onClose={() => setGalleryVisible(false)}
        onAddPhoto={openPicker}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
  emptyFrame: {
    height: 132,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.border,
    backgroundColor: Palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  thumb: {
    width: TILE,
    height: TILE,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Palette.cardMuted,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  addTile: {
    width: TILE,
    height: TILE,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.border,
    backgroundColor: Palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
