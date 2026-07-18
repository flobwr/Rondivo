import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { PhotoSourceSheet } from '@/components/documents/photos/PhotoSourceSheet';
import { Palette } from '@/theme';
import { InterventionPhoto } from '@/services/documents/photos';
import { pickFromCamera, pickFromLibrary } from '@/utils/photo-picker';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { SectionCard } from './SectionCard';

const SLOTS = 3;

function useSlotPress() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };
  return { scale, onPressIn, onPressOut };
}

function PhotoSlot({ photo, onPress }: { photo: InterventionPhoto; onPress: () => void }) {
  const press = useSlotPress();
  return (
    <Pressable
      style={styles.slot}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      accessibilityLabel="Voir la photo">
      <Animated.View style={[styles.slotFill, { transform: [{ scale: press.scale }] }]}>
        <Image source={{ uri: photo.uri }} style={styles.slotImage} contentFit="cover" />
      </Animated.View>
    </Pressable>
  );
}

function AddSlot({ onPress }: { onPress: () => void }) {
  const press = useSlotPress();
  return (
    <Pressable
      style={styles.slot}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      accessibilityLabel="Ajouter une photo">
      <Animated.View style={[styles.slotFill, styles.addSlot, { transform: [{ scale: press.scale }] }]}>
        <Feather name="plus" size={22} color={Palette.blue} />
      </Animated.View>
    </Pressable>
  );
}

function EmptySlot() {
  return (
    <View style={styles.slot}>
      <View style={[styles.slotFill, styles.emptySlot]} />
    </View>
  );
}

type Props = {
  photos: InterventionPhoto[];
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

  const hasMore = photos.length >= SLOTS;

  const slots = Array.from({ length: SLOTS }, (_, index) => {
    if (index < photos.length) {
      return <PhotoSlot key={photos[index].id} photo={photos[index]} onPress={() => setGalleryVisible(true)} />;
    }
    if (index === photos.length) {
      return <AddSlot key="add" onPress={openPicker} />;
    }
    return <EmptySlot key={`empty-${index}`} />;
  });

  return (
    <SectionCard>
      {hasMore ? (
        <Pressable style={styles.seeAll} onPress={() => setGalleryVisible(true)} hitSlop={6}>
          <Text style={styles.seeAllText}>Voir tout ({photos.length})</Text>
          <Feather name="chevron-right" size={13} color={Palette.blue} />
        </Pressable>
      ) : null}

      <View style={styles.row}>{slots}</View>

      <PhotoSourceSheet
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
    alignSelf: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  slot: {
    flex: 1,
    aspectRatio: 1,
  },
  slotFill: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  addSlot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.blue,
    backgroundColor: Palette.blueSoft,
  },
  emptySlot: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.border,
    backgroundColor: 'transparent',
  },
});
